
// This service handles text-to-speech functionality

class AudioService {
  private synth: SpeechSynthesis;
  private slowRate: number = 0.7; // Slower rate for children
  private normalRate: number = 1.0;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public speak(text: string, slow: boolean = true): void {
    if (!this.synth) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set a slower rate for children
    utterance.rate = slow ? this.slowRate : this.normalRate;
    
    // Use a clearer voice if available
    const voices = this.synth.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
    
    if (englishVoices.length > 0) {
      // Prefer a female voice as they tend to be clearer for children
      const femaleVoice = englishVoices.find(voice => voice.name.includes('female'));
      utterance.voice = femaleVoice || englishVoices[0];
    }
    
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();
export default audioService;
