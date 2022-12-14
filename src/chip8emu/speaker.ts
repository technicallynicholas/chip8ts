class Speaker {
  //TODO: Ensure scope and initialization of audio context and proper termination
  audioCtx: AudioContext;
  gain: GainNode;
  finish: AudioDestinationNode;
  oscillator: OscillatorNode | null;

  constructor() {
    const AudioContext = window.AudioContext;

    this.audioCtx = new AudioContext();
    this.gain = this.audioCtx.createGain();
    this.gain.gain.value = 0.02;
    this.finish = this.audioCtx.destination;

    this.gain.connect(this.finish);
    this.oscillator = this.audioCtx.createOscillator();
  }

  play(freq: number) {
    // if (this.audioCtx && !this.oscillator) {
    //   this.oscillator = this.audioCtx.createOscillator();
    //   this.oscillator.frequency.setValueAtTime(
    //     freq || 440,
    //     this.audioCtx.currentTime
    //   );
    //   this.oscillator.type = "square";
    //   this.oscillator.connect(this.gain);
    //   this.oscillator.start();
    // }
  }

  stop() {
    // if (this.oscillator) {
    //   this.oscillator.stop();
    //   this.oscillator.disconnect();
    //   this.oscillator = null;
    // }
  }
}

export default Speaker;
