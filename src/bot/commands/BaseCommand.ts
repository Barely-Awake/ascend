import { CommandCategory } from '../botData.js';
import {
  Message,
  CommandInteraction,
  SlashCommandBuilder,
  PermissionResolvable,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { findRequiredPermission } from '../../utils/discord/misc.js';

export default class BaseCommand {
  public Name: string;
  public Category: CommandCategory;
  public Description: string;
  public Parameters: CommandParameters;
  public RequiredParameters: CommandParameters;
  /**
   * Aliases are only used for message-based commands.
   **/
  public Aliases: string[];

  public RequireGuild: boolean;
  public ClientPermissions: PermissionResolvable[];
  public UserPermissions: PermissionResolvable[];

  constructor(baseInfo: BaseInfo) {
    this.Name = baseInfo.name;
    this.Category = baseInfo.category;
    this.Description = baseInfo.description;
    this.Parameters = baseInfo.parameters;
    this.RequiredParameters = this.Parameters.filter(
      (parameter) => parameter.required
    );

    this.Aliases = baseInfo.aliases;

    this.RequireGuild = baseInfo.requireGuild;
    this.ClientPermissions = baseInfo.clientPermissions;
    this.UserPermissions = baseInfo.userPermissions;

    if (
      !this.RequireGuild &&
      (this.ClientPermissions.length !== 0 || this.UserPermissions.length !== 0)
    ) {
      throw Error(
        `Command ${this.Name} does not require a guild but also requires client or user permissions`
      );
    }
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

      if (this.UserPermissions) {
        // TODO: Refactor to have permissions bit field be default field
        const requiredPermissions = new PermissionsBitField();
        this.UserPermissions.forEach((permission) => {
          requiredPermissions.add(permission);
        });
        interactionBuilder.setDefaultMemberPermissions(
          requiredPermissions.bitfield
        );
      }
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

    if (!message.member && (this.UserPermissions || this.ClientPermissions)) {
      return;
    }

    if (message.member && message.guild?.members.me) {
      const permissionResponse = this.checkPermissions(
        message.guild.members.me,
        message.member
      );

      if (permissionResponse !== null) {
        message.reply(permissionResponse);
        return;
      }
    }

    return this.messageHandler(message, args);
  }

  /**
   * Used for generic validation in every command, mainly permissions
   */
  interactionValidation(interaction: CommandInteraction) {
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
  interactionHandler(interaction: CommandInteraction): unknown {
    throw new Error('Method not implemented');
  }

  command(): unknown {
    throw new Error('Method not implemented');
  }

  checkPermissions(client: GuildMember, user: GuildMember) {
    const clientRequiredPermission = findRequiredPermission(
      client,
      this.ClientPermissions
    );
    if (clientRequiredPermission !== null) {
      return `Sorry I don't have the required permissions to execute this command (Missing ${clientRequiredPermission.join(
        ', '
      )})`;
    }

    const userRequiredPermissions = findRequiredPermission(
      user,
      this.UserPermissions
    );
    if (userRequiredPermissions !== null) {
      return `Sorry you don't have the required permissions to run this command (Missing ${userRequiredPermissions.join(
        ', '
      )})`;
    }

    return null;
  }
}

interface BaseInfo {
  name: string;
  category: CommandCategory;
  description: string;
  parameters: CommandParameters;
  aliases: string[];

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
