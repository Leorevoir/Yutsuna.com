import type { FSNode } from "./types";

/** TODO: create REAL files / folders */

export const createFSNode = (): { [key: string]: FSNode } => ({
  'about.txt': { type: 'file', name: 'about.txt', content: 'Yutsuna' },
  'projects': { type: 'directory', name: 'projects', children: {} }
});
