export function speakWithHighlight(text, onWordChange, rate = 0.9) {
  const words = text.split(' ');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.1; 

  // Estimate timing: average 200ms per word at rate 0.9
  const msPerWord = (60000 / (130 * rate)); 

  let index = 0;
  const interval = setInterval(() => {
    if (index < words.length) {
      onWordChange(index);
      index++;
    } else {
      clearInterval(interval);
      onWordChange(-1);  // reset to none
    }
  }, msPerWord);

  window.speechSynthesis.speak(utterance);
  return () => {
    clearInterval(interval);
    window.speechSynthesis.cancel();
  };
}

export class VoiceAgent {
  constructor(mode) {
    this.mode = mode;
    this.voices = [];
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
        this.voices = window.speechSynthesis.getVoices();
    }
  }

  getVoiceConfig() {
    const configs = {
      adhd:     { rate: 1.2, pitch: 1.3, voiceName: 'Google UK English Male' },
      asd:      { rate: 0.85, pitch: 1.0, voiceName: 'Google UK English Female' },
      dyslexia: { rate: 0.8, pitch: 1.1, voiceName: 'Google US English' },
    };
    return configs[this.mode] || configs.asd;
  }

  speak(text, onWord) {
    if (!window.speechSynthesis) return null;
    
    const config = this.getVoiceConfig();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate  = config.rate;
    utterance.pitch = config.pitch;

    const voice = this.voices.find(v => v.name.includes('Google')) || this.voices[0];
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  stop() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
  }
}
