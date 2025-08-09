import { useState, useCallback } from 'react';
import { Terminal } from '../tty/terminal';
import { createFSNode } from '../tty/filesystem';
import type { Command } from '../tty/types';

/** TODO: find a better way to handle clear command lmao */
const CLEAR_COMMAND = '[CLEAR]';

/**
 * @brief hook to manage terminal states (commands, input, executions...)
 */
export const useTerminalState = () => {

  const [commands, setCommands] = useState<Command[]>([]);
  const [current_input, setCurrentInput] = useState('');
  const [processor] = useState(() => new Terminal(createFSNode()));

  /**
   * @brief add a new command except if it is a clear command
   */
  const addCommand = useCallback((command: Command) => {
    if (command.output[0] === CLEAR_COMMAND) {
      setCommands([]);
    } else {
      setCommands((prev) => [...prev, command]);
    }
  }, []);

  /**
   * @brief execute a command on the processor (terminal)
   */
  const executeCommand = useCallback(
    (input: string) => {

      if (!input.trim()) {
        return;
      }

      const output = processor.execute(input);
      addCommand({
        input,
        output,
        timestamp: new Date(),
      });

      setCurrentInput('');
    },
    [processor, addCommand]
  );

  return {
    commands,
    current_input,
    setCurrentInput,
    executeCommand,
    processor,
  };
};
