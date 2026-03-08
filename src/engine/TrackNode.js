import { GAIN_SMOOTHING_TC, PAN_LEFT, PAN_RIGHT } from './constants.js';

export default class TrackNode {
  constructor(context, audioElement, destination) {
    this.context = context;
    this.audioElement = audioElement;

    // Create source ONCE per audio element
    this.source = context.createMediaElementSource(audioElement);

    // Left channel path
    this.gainLeft = context.createGain();
    this.panLeft = new StereoPannerNode(context, { pan: PAN_LEFT });

    // Right channel path
    this.gainRight = context.createGain();
    this.panRight = new StereoPannerNode(context, { pan: PAN_RIGHT });

    // Wire: source -> gainL -> panL -> destination
    //        source -> gainR -> panR -> destination
    this.source.connect(this.gainLeft);
    this.source.connect(this.gainRight);
    this.gainLeft.connect(this.panLeft);
    this.gainRight.connect(this.panRight);
    this.panLeft.connect(destination);
    this.panRight.connect(destination);

    // Default: both ears full volume
    this.gainLeft.gain.value = 1.0;
    this.gainRight.gain.value = 1.0;
  }

  setRouting(leftVol, rightVol) {
    const t = this.context.currentTime;
    this.gainLeft.gain.setTargetAtTime(leftVol, t, GAIN_SMOOTHING_TC);
    this.gainRight.gain.setTargetAtTime(rightVol, t, GAIN_SMOOTHING_TC);
  }

  async play() {
    try {
      await this.audioElement.play();
    } catch (e) {
      if (e.name !== 'AbortError') throw e;
    }
  }

  pause() {
    this.audioElement.pause();
  }

  seek(time) {
    this.audioElement.currentTime = time;
  }

  get currentTime() {
    return this.audioElement.currentTime;
  }

  get duration() {
    return this.audioElement.duration;
  }

  get playing() {
    return !this.audioElement.paused;
  }

  destroy() {
    this.audioElement.pause();
    this.source.disconnect();
    this.gainLeft.disconnect();
    this.gainRight.disconnect();
    this.panLeft.disconnect();
    this.panRight.disconnect();
    this.audioElement.src = '';
    this.audioElement.load();
  }
}
