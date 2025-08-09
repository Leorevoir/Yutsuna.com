import React from 'react';

/**
 * @brief terminal header component so basically whats written upper
 */
const TerminalHeader: React.FC = () => (
  <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span className="text-gray-300 ml-4">Terminal Portfolio - YutsuSH</span>
    </div>
    <div className="text-gray-500 text-sm">
      {new Date().toLocaleTimeString()}
    </div>
  </div>
);

export default TerminalHeader;
