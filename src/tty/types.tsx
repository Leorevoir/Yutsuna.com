/**
 * @brief linux-like filesystem interface
 */
export interface FSNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: { [key: string]: FSNode };
  permissions?: string;
  size?: number;
}

/**
 * @brief bash-like command interface
 */
export interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

/**
 * @brief YutsuSH (yutsu shell) terminal commands
 */
export abstract class YutsuSH {

  protected abstract _ls(path?: string): string[];
  protected abstract _cat(filename?: string): string[];
  protected abstract _cd(path?: string): string[];
  protected abstract _pwd(): string[];
  protected abstract _clear(): string[];
  protected abstract _help(): string[];
  protected abstract _whoami(): string[];
  protected abstract _date(): string[];
  protected abstract _uname(): string[];
  protected abstract _echo(...args: string[]): string[];
  protected abstract _tree(): string[];
  protected abstract _find(name?: string): string[];
  protected abstract _grep(pattern?: string, filename?: string): string[];
}

