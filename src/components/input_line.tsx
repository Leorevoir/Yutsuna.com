import React from 'react';

/**
 * @brief props for the input line component
 */
interface InputLineProps {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * @brief terminal like inputs component
 */
const InputLine: React.FC<InputLineProps> = ({
  prompt,
  value,
  onChange,
  onKeyDown,
  inputRef,
}) => (
  <div className="flex items-center text-green-400">
    <span className="text-blue-400 mr-2">{prompt}</span>
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="flex-1 bg-transparent outline-none text-white caret-green-400"
      autoComplete="off"
      spellCheck={false}
    />
    <span className="animate-pulse">█</span>
  </div>
);

export default InputLine;
