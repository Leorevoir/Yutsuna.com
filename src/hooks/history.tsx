import { useState, useCallback } from 'react';

/**
 * @brief hook to manage command history for YutsuShell
 */
const useCommandHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [history_index, setHistoryIndex] = useState(-1);

  /**
   * @brief push a command to the history
   */
  const addToHistory = useCallback((command: string) => {
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
  }, []);

  /**
   * @brief navigate through the command history
   */
  const navigateHistory = useCallback((direction: 'up' | 'down') => {

    if (direction === 'up' && history.length > 0) {
      const new_index = history_index === -1 ? history.length - 1 : Math.max(0, history_index - 1);

      setHistoryIndex(new_index);
      return history[new_index];

    } else if (direction === 'down' && history_index !== -1) {

      const new_index = history_index + 1;

      if (new_index >= history.length) {
        setHistoryIndex(-1);
        return '';
      }

      setHistoryIndex(new_index);
      return history[new_index];
    }
    return null;
  },
    [history, history_index]
  );

  return { addToHistory, navigateHistory };
};

export default useCommandHistory;
