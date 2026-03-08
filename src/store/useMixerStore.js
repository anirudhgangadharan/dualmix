import { create } from 'zustand';
import { engine } from '../engine/AudioEngine.js';

const useMixerStore = create((set, get) => ({
  // channels: { [trackId]: { leftGain, rightGain, routing, volume } }
  channels: {},

  initChannel: (trackId) => {
    set((state) => ({
      channels: {
        ...state.channels,
        [trackId]: { leftGain: 1.0, rightGain: 1.0, routing: 'both', volume: 1.0, loop: false },
      },
    }));
    engine.setTrackRouting(trackId, 1.0, 1.0);
  },

  removeChannel: (trackId) => {
    set((state) => {
      const { [trackId]: _, ...rest } = state.channels;
      return { channels: rest };
    });
  },

  setRouting: (trackId, routing) => {
    const ch = get().channels[trackId];
    const vol = ch?.volume ?? 1.0;
    // Perceptual: square the volume slider value
    const pVol = vol * vol;
    const gains = {
      left: { leftGain: pVol, rightGain: 0.0 },
      right: { leftGain: 0.0, rightGain: pVol },
      both: { leftGain: pVol, rightGain: pVol },
    };
    const g = gains[routing];
    set((state) => ({
      channels: {
        ...state.channels,
        [trackId]: { ...state.channels[trackId], ...g, routing, volume: vol },
      },
    }));
    engine.setTrackRouting(trackId, g.leftGain, g.rightGain);
  },

  setVolume: (trackId, volume) => {
    const ch = get().channels[trackId];
    if (!ch) return;
    const pVol = volume * volume;
    const gains = {
      left: { leftGain: pVol, rightGain: 0.0 },
      right: { leftGain: 0.0, rightGain: pVol },
      both: { leftGain: pVol, rightGain: pVol },
    };
    const g = gains[ch.routing];
    set((state) => ({
      channels: {
        ...state.channels,
        [trackId]: { ...state.channels[trackId], ...g, volume },
      },
    }));
    engine.setTrackRouting(trackId, g.leftGain, g.rightGain);
  },

  toggleLoop: (trackId) => {
    set((state) => ({
      channels: {
        ...state.channels,
        [trackId]: { ...state.channels[trackId], loop: !state.channels[trackId]?.loop },
      },
    }));
  },

  setEarVolume: (trackId, ear, value) => {
    const pVal = value * value;
    const key = ear === 'left' ? 'leftGain' : 'rightGain';
    set((state) => ({
      channels: {
        ...state.channels,
        [trackId]: { ...state.channels[trackId], [key]: pVal, routing: 'custom' },
      },
    }));
    const ch = get().channels[trackId];
    engine.setTrackRouting(trackId, ch.leftGain, ch.rightGain);
  },
}));

export default useMixerStore;
