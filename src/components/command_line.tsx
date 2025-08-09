import React from 'react';
import { formatOutput } from '../utils/format_output';
import type { Command } from '../tty/types';

/**
 * @brief props for the command line component
 */
interface CommandLineProps {
  command: Command;
  prompt: string;
}

/**
 * @brief command line component to display a command & its output
 */
const CommandLine: React.FC<CommandLineProps> = ({ command, prompt }) => (
  <div className="mb-2">
    {command.input && (
      <div className="flex items-center text-green-400">
        <span className="text-blue-400 mr-2">{prompt}</span>
        <span className="text-white">{command.input}</span>
      </div>
    )}
    <div className="mt-1">
      {command.output.map((line, line_index) => (
        <div
          key={line_index}
          className="leading-6"
          dangerouslySetInnerHTML={{ __html: formatOutput(line) }}
        />
      ))}
    </div>
  </div>
);

export default CommandLine;
