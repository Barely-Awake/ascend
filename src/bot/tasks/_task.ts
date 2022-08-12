import { Client } from 'discord.js';

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

  task(client: Client) {
    return client;
  }
}

export interface TaskClass {
  name: string;
  interval: number;
  task: TaskFunction;
}

type TaskFunction = (client: Client) => unknown
