import { type FSNode, YutsuSH } from './types';

export class Terminal extends YutsuSH {

  private _fs: { [key: string]: FSNode };
  private _current: string[];

  private readonly _cmd_map = {
    ls: this._ls.bind(this),
    cat: this._cat.bind(this),
    cd: this._cd.bind(this),
    pwd: this._pwd.bind(this),
    clear: this._clear.bind(this),
    help: this._help.bind(this),
    whoami: this._whoami.bind(this),
    date: this._date.bind(this),
    uname: this._uname.bind(this),
    echo: this._echo.bind(this),
    tree: this._tree.bind(this),
    find: this._find.bind(this),
    grep: this._grep.bind(this)
  } as const;

  /**
   * public
   */

  constructor(filesystem: { [key: string]: FSNode }) {
    super();
    this._fs = filesystem;
    this._current = [];
  }

  /**
   * @brief parse the input command & execute it
   */
  execute(input: string): string[] {
    const [command, ...args] = input.trim().split(/\s+/);
    const method = this._cmd_map[command as keyof typeof this._cmd_map];

    if (method) {
      return method(...args);
    }
    return [`yutsh: ${command}: command not found. Type 'help' for available commands.`];
  }


  /**
   * getters
   */

  getCurrentPath(): string {
    return this._current.join('/');
  }

  /**
   * protected
   */

  /**
   * @brief yutsu shell (YutsuSH) commands
   */

  protected _ls(path?: string): string[] {
    const target = path
      ? this._resolve(path)
      : { type: 'directory' as const, children: this._getCurrent() };

    if (!target) return [`ls: cannot access '${path}': No such file or directory`];
    if (target.type === 'file') return [target.name];
    if (!target.children) return ['ls: cannot access directory'];

    return Object.values(target.children).map(node => {
      const color = node.type === 'directory' ? '\x1b[34m' : '\x1b[37m';
      return `${color}${node.name}\x1b[0m`;
    });
  }

  protected _cat(filename?: string): string[] {
    if (!filename) return ['cat: missing file operand'];
    const file = this._resolve(filename);
    if (!file) return [`cat: ${filename}: No such file or directory`];
    if (file.type === 'directory') return [`cat: ${filename}: Is a directory`];
    return file.content?.split('\n') ?? [''];
  }

  protected _cd(path?: string): string[] {
    if (!path || path === '~') {
      this._current = [];
      return [];
    }
    if (path === '..') {
      this._current.pop();
      return [];
    }

    const target = this._resolve(path);

    if (!target) {
      return [`cd: ${path}: No such file or directory`];
    }
    if (target.type === 'file') {
      return [`cd: ${path}: Not a directory`];
    }
    this._current.push(...path.split('/').filter(Boolean));
    return [];
  }

  protected _pwd(): string[] {
    return [`/home/portfolio${this._current.length ? '/' + this._current.join('/') : ''}`];
  }

  protected _help(): string[] {
    return [
      'Available commands:',
      '  ls [path]           List files and directories',
      '  cat <file>          Display file contents',
      '  cd <dir>            Change current directory',
      '  pwd                 Print working directory',
      '  clear               Clear the terminal screen',
      '  help                Show this help message',
      '  whoami              Display current user',
      '  date                Show system date and time',
      '  uname               Show system information',
      '  echo <text>         Print text to stdout',
      '  tree                Display directory tree',
      '  find <name>         Search for a file or directory by name',
      '  grep <pattern> <file>  Search for pattern in file'
    ];
  }

  protected _tree(): string[] {
    const items = Object.values(this._getCurrent());
    return items.map((item, index) => {
      const connector = index === items.length - 1 ? '└── ' : '├── ';
      const icon = item.type === 'directory' ? '📁 ' : '📄 ';
      return `${connector}${icon}${item.name}`;
    });
  }

  protected _find(name?: string): string[] {

    if (!name) {
      return ['find: missing search term'];
    }

    const results: string[] = [];
    const search = (obj: { [k: string]: FSNode }, path: string) => {

      for (const [key, node] of Object.entries(obj)) {
        const full_path = path ? `${path}/${key}` : key;
        if (node.name.includes(name)) {
          results.push(full_path);
        }
        if (node.type === 'directory' && node.children) {
          search(node.children, full_path);
        }
      }
    };
    search(this._fs, '');
    return results.length ? results : [`find: '${name}' not found`];
  }

  protected _grep(pattern?: string, filename?: string): string[] {
    if (!pattern || !filename) {
      return ['grep: missing pattern or filename'];
    }

    const file = this._resolve(filename);

    if (!file || file.type === 'directory' || !file.content) {
      return [`grep: ${filename}: No such file or directory`];
    }

    const matches = file.content.split('\n').filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
    return matches.length ? matches : [`grep: no matches found for '${pattern}'`];
  }

  protected _clear(): string[] {
    return ['[CLEAR]'];
  }

  protected _whoami(): string[] {
    return ['Yutsuna'];
  }

  protected _date(): string[] {
    const now = new Date();
    return [now.toLocaleString()];
  }

  protected _uname(): string[] {
    return ['YutsuSH: Yutsu Shell v0.0.1'];
  }

  protected _echo(...args: string[]): string[] {
    return [args.join(' ')];
  }

  /**
  * private
  */

  /**
  * @brief return the current directory's children
  */
  private _getCurrent(): { [key: string]: FSNode } {
    let current = this._fs;
    for (const segment of this._current) {
      const node = current[segment];
      if (node?.type === 'directory' && node.children) {
        current = node.children;
      }
    }
    return current;
  }

  /**
  * @brief resolve a path to a FSNode (filesystem node)
  */
  private _resolve(path: string): FSNode | null {
    if (!path || path === '.') {
      return { type: 'directory', name: '.', children: this._getCurrent() };
    }

    const segments = path.split('/').filter(Boolean);
    let current = this._fs;
    const current_path = [...this._current];

    for (const segment of segments) {

      if (segment === '..') {
        current_path.pop();
        current = this._walk(current_path);
        continue;
      }

      const node = current[segment];

      if (!node) {
        return null;
      }
      if (node.type === 'directory' && node.children) {
        current = node.children;
        current_path.push(segment);
      } else {
        return node;
      }
    }
    return { type: 'directory', name: segments.at(-1) || '.', children: current };
  }

  /**
  * @brief walk through the filesystem to find the current directory's children
  */
  private _walk(path: string[]): { [key: string]: FSNode } {
    let current = this._fs;

    for (const seg of path) {
      const node = current[seg];

      if (node?.type === 'directory' && node.children) {
        current = node.children;
      }

    }
    return current;
  }

}

