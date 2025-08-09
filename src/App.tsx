import React from 'react';
import TerminalHeader from './components/header';
import TerminalBody from './components/body';
import { useTerminalState } from './hooks/state';

/**
 * @brief terminal app entry point
 */
const App: React.FC = () => {
  const { commands, current_input, setCurrentInput, executeCommand, processor } = useTerminalState();

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono overflow-hidden">
      <TerminalHeader />
      <TerminalBody
        commands={commands}
        current_input={current_input}
        setCurrentInput={setCurrentInput}
        executeCommand={executeCommand}
        processor={processor}
      />
    </div>
  );
};

export default App;
