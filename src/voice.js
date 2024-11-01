import recorder from 'node-record-lpcm16';
import say from 'say';
import chalk from 'chalk';

let recording = null;

export function startVoiceRecording() {
  return new Promise((resolve) => {
    console.log(chalk.yellow('\n🎤 Listening... (Press Ctrl+C to stop)'));
    
    const chunks = [];
    recording = recorder.record({
      sampleRate: 16000,
      channels: 1,
      audioType: 'wav'
    });

    recording.stream()
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve("I heard you speaking");
      });
  });
}

export function stopVoiceRecording() {
  if (recording) {
    recording.stop();
    recording = null;
  }
}

export function speakResponse(text) {
  return new Promise((resolve) => {
    say.speak(text, null, 1.0, (err) => {
      if (err) console.error(chalk.red('Speech error:', err));
      resolve();
    });
  });
}