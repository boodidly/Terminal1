import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { BANNER, MODEL } from './src/config.js';
import { startVoiceRecording, stopVoiceRecording, speakResponse } from './src/voice.js';
import { checkOllamaServer, generateResponse } from './src/ollama.js';
import { typeText } from './src/display.js';

let isVoiceMode = false;

const spinner = ora({
  text: chalk.cyan('Thinking...'),
  color: 'yellow',
  isEnabled: true,
  stream: process.stdout
});

async function getInput() {
  const { prompt } = await inquirer.prompt([{
    type: 'input',
    name: 'prompt',
    message: chalk.blue('You'),
    prefix: '',
    suffix: '',
    transformer: (input) => input,
    validate: () => true,
    waitUserInput: false
  }]);
  return prompt;
}

async function chat() {
  console.clear();
  process.stdout.write(BANNER + '\n');
  process.stdout.write(chalk.cyan.bold('🤖 Ollama Terminal Chat\n'));
  process.stdout.write(chalk.green(`Model: ${MODEL}\n`));
  process.stdout.write(chalk.dim('Type "exit" to quit or "voice" to toggle voice mode\n\n'));

  await checkOllamaServer();

  while (true) {
    let prompt;
    
    if (isVoiceMode) {
      prompt = await startVoiceRecording();
      stopVoiceRecording();
    } else {
      prompt = await getInput();
    }

    if (!prompt) continue;

    const promptLower = prompt.toLowerCase();
    if (promptLower === 'exit') {
      process.stdout.write(chalk.cyan('\n👋 Thanks for chatting!\n'));
      process.exit(0);
    }

    if (promptLower === 'voice') {
      isVoiceMode = !isVoiceMode;
      process.stdout.write(chalk.green(`\nVoice mode ${isVoiceMode ? 'enabled' : 'disabled'}\n`));
      continue;
    }

    spinner.start();
    try {
      const response = await generateResponse(prompt);
      spinner.stop();
      process.stdout.write('\n');
      process.stdout.write(chalk.yellow('AI: '));
      await typeText(response);
      process.stdout.write('\n\n');
      
      if (isVoiceMode) {
        await speakResponse(response);
      }
    } catch (error) {
      spinner.stop();
      process.stdout.write(`${chalk.red('\n❌ Error:')} ${error.message}\n`);
    }
  }
}

process.on('SIGINT', () => {
  stopVoiceRecording();
  spinner.stop();
  process.stdout.write(chalk.cyan('\n👋 Thanks for chatting!\n'));
  process.exit(0);
});

chat();