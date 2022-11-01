export type NameHistory = MojangNameHistoryIndex[];

interface MojangNameHistoryIndex {
  name: string;
  changedToAt?: number;
}

export interface PlayerUuid {
  name: string;
  id: string;
}
