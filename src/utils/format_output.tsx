const ESCAPE_CHAR = '\x1b';

/**
 * @brief formats the output text by replacing ANSI escape codes with HTML spans
 */
export const formatOutput = (text: string): string => {
  return text
    .replace(new RegExp(`${ESCAPE_CHAR}\\[34m`, 'g'), '<span class="text-blue-400">')
    .replace(new RegExp(`${ESCAPE_CHAR}\\[37m`, 'g'), '<span class="text-green-400">')
    .replace(new RegExp(`${ESCAPE_CHAR}\\[0m`, 'g'), '</span>');
};
