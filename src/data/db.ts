import Dexie, { Table } from "dexie";

export type Category =
  | "Early Childhood"
  | "School"
  | "Friends"
  | "Family"
  | "Funny Stories"
  | "Work"
  | "Travel"
  | "Hobbies"
  | "Life Lessons"
  | "Recipes"
  | "Other";

export const CATEGORIES: Category[] = [
  "Early Childhood",
  "School",
  "Friends",
  "Family",
  "Funny Stories",
  "Work",
  "Travel",
  "Hobbies",
  "Life Lessons",
  "Recipes",
  "Other",
];

export type MemoryType = "audio" | "video" | "photo" | "text";

export interface Memory {
  id?: number;
  title: string;
  category: Category;
  type: MemoryType;
  createdAt: number; // epoch ms
  notes?: string;
  blob?: Blob; // audio/video/photo
  fileName?: string;
  durationMs?: number;
}

class MemoryDB extends Dexie {
  memories!: Table<Memory, number>;

  constructor() {
    super("life-memory-keeper");
    this.version(1).stores({
      memories: "++id, createdAt, category, type",
    });
  }
}

export const db = new MemoryDB();

export async function addMemory(memory: Memory) {
  return db.memories.add(memory);
}

export async function getAllMemories() {
  return db.memories.orderBy("createdAt").reverse().toArray();
}

export async function deleteMemory(id: number) {
  return db.memories.delete(id);
}
