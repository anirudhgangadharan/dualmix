import TrackNode from './TrackNode.js';

class AudioEngine {
  constructor() {
    this.context = null;
    this.tracks = new Map(); // trackId -> TrackNode
    this.masterGain = null;
  }

  init() {
    if (this.context) return;
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
  }

  async ensureResumed() {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  addTrack(trackId, audioElement) {
    if (this.tracks.has(trackId)) return this.tracks.get(trackId);
    this.init();
    const track = new TrackNode(this.context, audioElement, this.masterGain);
    this.tracks.set(trackId, track);
    return track;
  }

  removeTrack(trackId) {
    const track = this.tracks.get(trackId);
    if (track) {
      track.destroy();
      this.tracks.delete(trackId);
    }
  }

  setTrackRouting(trackId, leftGain, rightGain) {
    const track = this.tracks.get(trackId);
    if (track) track.setRouting(leftGain, rightGain);
  }

  getTrack(trackId) {
    return this.tracks.get(trackId);
  }
}

export const engine = new AudioEngine();
