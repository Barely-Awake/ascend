type NameHistory = MojangNameHistoryIndex[]

interface MojangNameHistoryIndex {
  name: string;
  changedToAt?: number;
}

export default NameHistory;