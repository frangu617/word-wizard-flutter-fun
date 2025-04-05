// This service handles text-to-speech functionality

class AudioService {
  private synth: SpeechSynthesis;
  private slowRate: number = 0.75; // Slightly faster but still child-friendly
  private normalRate: number = 1.0;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};

  constructor() {
    this.synth = window.speechSynthesis;
    // Initialize voice when the service is created
    this.initializeVoice();
    
    // Initialize audio context for sound effects
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.loadSounds();
      } catch (e) {
        console.error('Web Audio API is not supported in this browser', e);
      }
    }
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
  
  // Load sound effects
  private loadSounds(): void {
    if (!this.audioContext) return;
    
    // Define sound effects to load
    const soundsToLoad = {
      'success': '/sounds/success.mp3',
      'error': '/sounds/error.mp3'
    };
    
    // Create simple beep sounds since we don't have actual files
    this.generateBeepSounds();
  }
  
  // Generate simple beep sounds for success and error
  private generateBeepSounds(): void {
    if (!this.audioContext) return;
    
    // Create a success sound (higher pitch beep)
    const successBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const successChannel = successBuffer.getChannelData(0);
    for (let i = 0; i < successBuffer.length; i++) {
      // Higher pitch tone that rises
      successChannel[i] = Math.sin(i * 0.04) * Math.exp(-i * 2 / successBuffer.length);
    }
    this.sounds['success'] = successBuffer;
    
    // Create an error sound (lower pitch beep)
    const errorBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const errorChannel = errorBuffer.getChannelData(0);
    for (let i = 0; i < errorBuffer.length; i++) {
      // Lower pitch tone that falls
      errorChannel[i] = Math.sin(i * 0.02) * Math.exp(-i * 3 / errorBuffer.length);
    }
    this.sounds['error'] = errorBuffer;
  }
  
  // Play a sound effect
  public playSound(name: string): void {
    if (!this.audioContext || !this.sounds[name]) {
      console.warn(`Sound "${name}" not available`);
      return;
    }
    
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.audioContext.destination);
      source.start();
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();
export default audioService;
