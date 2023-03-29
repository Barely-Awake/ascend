import { CommandCategory } from '../botData.js';
import {
  Message,
  CommandInteraction,
  SlashCommandBuilder,
  PermissionResolvable,
} from 'discord.js';

export default class BaseCommand {
  public Name: string;
  public Category: CommandCategory;
  public Description: string;
  public Parameters: CommandParameters;
  /**
   * Aliases are only used for message-based commands. If a command doesn't need any aliases, null is also valid.
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

    this.Aliases = baseInfo.aliases;

    this.RequireGuild = baseInfo.requireGuild;
    this.ClientPermissions = baseInfo.clientPermissions;
    this.UserPermissions = baseInfo.userPermissions;
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
  }

  /**
   * Used for validating context such as permissions, arguments, etc.
   */
  messageValidation(message: Message, args: string[]): boolean {
    return true;
  }

  /**
   * Used for validating context such as permissions, arguments, etc.
   */
  interactionValidation(interaction: CommandInteraction): boolean {
    return true;
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
