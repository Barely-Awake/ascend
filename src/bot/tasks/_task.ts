import { Client } from 'discord.js';
import mongoosePkg from 'mongoose';

export default class _Example implements TaskClass {
  public name: string;
  public interval: number;

  constructor(
    name = 'Example',
    interval = 60 * 1000,
  ) {
    this.name = name;
    this.interval = interval;
  }

  task(botClient: Client, mongoClient: typeof mongoosePkg) {
    return [botClient, mongoClient];
  }
}

export interface TaskClass {
  name: string;
  interval: number;
  task: TaskFunction;
}

type TaskFunction = (botClient: Client, mongoClient: typeof mongoosePkg) => any
