import { CommandCategory } from '../botData.js';
import {
  Message,
  SlashCommandBuilder,
  PermissionResolvable,
  PermissionsBitField,
  ChatInputCommandInteraction,
} from 'discord.js';
import { getMissingPermissions } from '../../utils/discord/misc.js';

export default class BaseCommand {
  public Name: string;
  /**
   * Aliases are only used for message-based commands.
   **/
  public Aliases: string[];
  public Category: CommandCategory;
  public Description: string;

  public Parameters: CommandParameters;
  public RequiredParameters: CommandParameters;

  public RequireGuild: boolean;
  public ClientPermissions: PermissionsBitField;
  public UserPermissions: PermissionsBitField;

  constructor(baseInfo: BaseInfo) {
    this.Name = baseInfo.name;
    this.Aliases = baseInfo.aliases;
    this.Category = baseInfo.category;
    this.Description = baseInfo.description;

    this.Parameters = baseInfo.parameters;

    this.RequiredParameters = this.Parameters.filter(
      (parameter) => parameter.required
    );

    this.RequireGuild = baseInfo.requireGuild;
    if (
      !this.RequireGuild &&
      (baseInfo.clientPermissions.length !== 0 ||
        baseInfo.userPermissions.length !== 0)
    ) {
      throw Error(
        `Command ${this.Name} does not require a guild but also requires client or user permissions`
      );
    }

    this.ClientPermissions = new PermissionsBitField(
      baseInfo.clientPermissions
    );
    this.UserPermissions = new PermissionsBitField(baseInfo.userPermissions);
  }

  interactionMeta() {
    const interactionBuilder = new SlashCommandBuilder()
      .setName(this.Name)
      .setDescription(this.Description);
    this.Parameters.forEach((parameter) => {
      /* Couldn't find a type that worked to specify option parameter, it should just be a generic option type*/
      interactionBuilder[`add${parameter.type}Option`]((option: any) =>
        option
          .setName(parameter.name)
          .setDescription(parameter.description)
          .setRequired(parameter.required)
      );
    });

    if (this.RequireGuild) {
      interactionBuilder.setDMPermission(false);

      interactionBuilder.setDefaultMemberPermissions(
        this.UserPermissions.bitfield
      );
    }

    return interactionBuilder;
  }

  /**
   * Used for generic validation in every command, mainly permissions
   */
  messageValidation(message: Message, args: string[]) {
    if (this.RequireGuild && !message.inGuild()) {
      message.reply('That command can only be run in a guild!');
      return;
    }

    // Checks if the trigger for this command wasn't a guild member and that there are permissions required to run it.
    if (!message.member && (this.UserPermissions || this.ClientPermissions)) {
      // If that's the case, it's most likely something like a webhook, so it shouldn't be necessary to send a response.
      return;
    }

    if (message.member && message.guild?.members.me) {
      const missingClientPerms = getMissingPermissions(
        message.guild.members.me,
        this.ClientPermissions
      );

      if (missingClientPerms !== null) {
        message.reply(
          `Sorry, I don't have the required permissions to execute that command! (Missing: ${missingClientPerms.join(
            ', '
          )}`
        );
      }

      const missingUserPerms = getMissingPermissions(
        message.member,
        this.UserPermissions
      );

      if (missingUserPerms !== null) {
        message.reply(
          `Sorry, you don't have the required permissions to run that command! (${missingUserPerms.join(
            ', '
          )}`
        );
      }
    }

    return this.messageHandler(message, args);
  }

  /**
   * Used for generic validation in every command, mainly permissions
   */
  interactionValidation(interaction: ChatInputCommandInteraction) {
    if (interaction.appPermissions?.has(this.ClientPermissions)) {
      return interaction.reply(
        `Sorry I don't have the required permissions to execute this command`
      );
    }

    return this.interactionHandler(interaction);
  }

  /**
   * Should only be used for things like getting required context or channels and sending response.
   * The main logic should be handled in the command method.
   **/
  messageHandler(message: Message, args: string[]): unknown {
    throw new Error('Method not implemented');
  }

  /**
   * Should only be used for things like getting required context or channels and sending response.
   * The main logic should be handled in the command method.
   **/
  interactionHandler(interaction: ChatInputCommandInteraction): unknown {
    throw new Error('Method not implemented');
  }

  command(): unknown {
    throw new Error('Method not implemented');
  }
}

interface BaseInfo {
  name: string;
  aliases: string[];
  category: CommandCategory;
  description: string;

  parameters: CommandParameters;

  requireGuild: boolean;
  clientPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
}

export type CommandParameters = Parameter[];

interface Parameter {
  type: CommandParameterTypes;
  name: string;
  description: string;
  required: boolean;
}

type CommandParameterTypes =
  | 'Attachment'
  | 'Boolean'
  | 'Channel'
  | 'Integer'
  | 'Mentionable'
  | 'Number'
  | 'Role'
  | 'String'
  | 'User';
