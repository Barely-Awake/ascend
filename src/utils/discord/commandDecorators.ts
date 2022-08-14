import { PermissionResolvable } from 'discord.js';

export function requirePermission(permission: PermissionResolvable) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.member.permissions.has(permission))
        return message.reply('You don\'t have the required permissions');

      return originalFunction.apply(this, arguments);
    };
  };
}

export function requireBotPermission(permission: PermissionResolvable) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.guild.me.permissions.has(permission))
        return message.reply('I don\'t have the required permissions' +
          '(*I\'m a moderation bot, it\'s recommended to give me admin*)');

      return originalFunction.apply(this, arguments);
    };
  };
}

export function onlyInGuild() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      if (!message.guild || !message.member)
        return message.reply('This command must be run in a guild');

      return originalFunction.apply(this, arguments);
    };
  };
}

export function requireArgs(argNumber: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function () {
      const message = arguments[0];
      const args = arguments[1];
      if (args.length < argNumber)
        return message.reply('You must provide enough arguments');

      return originalFunction.apply(this, arguments);
    };
  };
}
