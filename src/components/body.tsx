import React, { useEffect, useRef, useCallback } from 'react';
import useCommandHistory from '../hooks/history';
import CommandLine from './command_line';
import InputLine from './input_line';
import type { Command } from '../tty/types';
import type { Terminal as TerminalType } from '../tty/terminal';

/**
 * @brief props for the terminal body component
 */
interface TerminalBodyProps {
  commands: Command[];
  current_input: string;
  setCurrentInput: (value: string) => void;
  executeCommand: (input: string) => void;
  processor: TerminalType;
}

/**
 * @brief component that displays the body & input of the terminal
 */
const TerminalBody: React.FC<TerminalBodyProps> = ({
  commands,
  current_input,
  setCurrentInput,
  executeCommand,
  processor,
}) => {

  const terminal_ref = useRef<HTMLDivElement>(null);
  const input_ref = useRef<HTMLInputElement>(null);
  const { addToHistory, navigateHistory } = useCommandHistory();

  useEffect(() => {
    executeCommand('');
  }, [executeCommand]);

  useEffect(() => {
    terminal_ref.current?.scrollTo({
      top: terminal_ref.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [commands]);

  useEffect(() => {
    input_ref.current?.focus();
  }, []);

  /** 
   * @brief PS1 prompt
   */
  const getPrompt = useCallback(() => {
    const path = processor.getCurrentPath();
    const display_path = path ? `~/portfolio/${path}` : '~/portfolio';
    return `yutsuna@portfolio:${display_path}$`;
  }, [processor]);

  /**
   * @brief arrow key navigation for history
   */
  const handleArrowNavigation = useCallback(
    (direction: 'up' | 'down') => {
      const result = navigateHistory(direction);
      if (result !== null && result !== current_input) {
        setCurrentInput(result);
      }
    },
    [navigateHistory, setCurrentInput, current_input]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          executeCommand(current_input);
          addToHistory(current_input);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleArrowNavigation('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleArrowNavigation('down');
          break;
        case 'Tab':
          e.preventDefault();
          break;
      }
    },
    [current_input, executeCommand, addToHistory, handleArrowNavigation]
  );

  /**
   * @brief focus the input field when clicking on the terminal body
   */
  const focusInput = useCallback(() => {
    input_ref.current?.focus();
  }, []);

  return (
    <div
      ref={terminal_ref}
      className="p-4 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth cursor-text"
      onClick={focusInput}
    >
      {commands.map((command, index) => (
        <CommandLine
          key={`${command.timestamp.getTime()}-${index}`}
          command={command}
          prompt={getPrompt()}
        />
      ))}
      <InputLine
        prompt={getPrompt()}
        value={current_input}
        onChange={setCurrentInput}
        onKeyDown={handleKeyDown}
        inputRef={input_ref}
      />
    </div>
  );
};

export default TerminalBody;
