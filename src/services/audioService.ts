
// This service handles text-to-speech functionality

class AudioService {
  private synth: SpeechSynthesis;
  private slowRate: number = 0.75; // Slightly faster but still child-friendly
  private normalRate: number = 1.0;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    // Initialize voice when the service is created
    this.initializeVoice();
  }

  private initializeVoice(): void {
    if (!this.synth) return;
    
    // Wait for voices to be loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.selectBestVoice.bind(this);
    }
    
    // Try to select immediately in case voices are already loaded
    this.selectBestVoice();
  }
  
  private selectBestVoice(): void {
    const voices = this.synth.getVoices();
    
    // Filter for English voices first
    let englishVoices = voices.filter(voice => 
      voice.lang.includes('en-') || voice.lang === 'en'
    );
    
    if (englishVoices.length === 0) {
      englishVoices = voices; // Fallback to all voices if no English ones
    }
    
    // Preferred voice priority:
    // 1. Look for specific kid-friendly voices by name
    const kidFriendlyVoiceNames = ['samantha', 'karen', 'daniel', 'alex', 'victoria'];
    
    for (const name of kidFriendlyVoiceNames) {
      const foundVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes(name)
      );
      if (foundVoice) {
        this.preferredVoice = foundVoice;
        console.log(`Selected kid-friendly voice: ${foundVoice.name}`);
        return;
      }
    }
    
    // 2. Prefer Google or Microsoft voices which tend to sound more natural
    const premiumVoice = englishVoices.find(v => 
      v.name.includes('Google') || v.name.includes('Microsoft')
    );
    
    if (premiumVoice) {
      this.preferredVoice = premiumVoice;
      console.log(`Selected premium voice: ${premiumVoice.name}`);
      return;
    }
    
    // 3. Default to first English voice if available
    if (englishVoices.length > 0) {
      this.preferredVoice = englishVoices[0];
      console.log(`Selected default voice: ${englishVoices[0].name}`);
    }
  }

  public speak(text: string, slow: boolean = true): void {
    if (!this.synth) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set a child-appropriate rate
    utterance.rate = slow ? this.slowRate : this.normalRate;
    
    // Use medium-high pitch for clarity
    utterance.pitch = 1.1;
    
    // Set volume to be clear but not too loud
    utterance.volume = 0.9;
    
    // Use the preferred voice if we found one
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  // Get available voices for debugging
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices() : [];
  }
}

// Create a singleton instance
const audioService = new AudioService();
export default audioService;
