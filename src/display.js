import { stdout } from 'process';
import chalk from 'chalk';

const TYPING_SPEED = {
  min: 10,  // Minimum delay between characters in ms
  max: 30   // Maximum delay between characters in ms
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function typeText(text) {
  const words = text.split(' ');
  let line = '';
  const terminalWidth = stdout.columns || 80;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Check if adding the next word would exceed terminal width
    if ((line + word).length > terminalWidth - 5) {
      stdout.write(chalk.white(line) + '\n');
      line = '';
      await sleep(TYPING_SPEED.max); // Slight pause at line breaks
    }
    
    // Type each character in the word
    for (const char of word) {
      line += char;
      stdout.write(chalk.white(char));
      await sleep(Math.random() * (TYPING_SPEED.max - TYPING_SPEED.min) + TYPING_SPEED.min);
    }
    
    // Add space between words
    if (i < words.length - 1) {
      line += ' ';
      stdout.write(' ');
      await sleep(TYPING_SPEED.min);
    }
  }
  
  // Write any remaining text
  if (line) {
    stdout.write(chalk.white(line));
  }
}