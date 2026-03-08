import { create } from 'zustand';
import { engine } from '../engine/AudioEngine.js';
import { getFileUrl } from '../utils/fileAccess.js';

let trackCounter = 0;

const usePlayerStore = create((set, get) => ({
  // activeTracks: [{ trackId, fileInfo, audioEl, currentTime, duration, playing }]
  activeTracks: [],

  addTrack: async (fileInfo) => {
    const trackId = `track-${++trackCounter}`;
    const audioEl = new Audio();
    audioEl.crossOrigin = 'anonymous';
    audioEl.preload = 'auto';

    // Get URL from either FileSystemFileHandle or direct File
    let url;
    if (fileInfo.handle) {
      url = await getFileUrl(fileInfo.handle);
    } else if (fileInfo.file) {
      url = URL.createObjectURL(fileInfo.file);
    }
    audioEl.src = url;

    // Wait for metadata
    await new Promise((resolve) => {
      if (audioEl.readyState >= 1) return resolve();
      audioEl.addEventListener('loadedmetadata', resolve, { once: true });
      audioEl.addEventListener('error', resolve, { once: true });
    });

    // Initialize audio engine on first interaction
    engine.init();
    await engine.ensureResumed();
    engine.addTrack(trackId, audioEl);

    const track = {
      trackId,
      fileInfo,
      audioEl,
      currentTime: 0,
      duration: audioEl.duration || 0,
      playing: false,
      objectUrl: url,
    };

    // Time update listener
    audioEl.addEventListener('timeupdate', () => {
      set((state) => ({
        activeTracks: state.activeTracks.map((t) =>
          t.trackId === trackId ? { ...t, currentTime: audioEl.currentTime } : t
        ),
      }));
    });

    audioEl.addEventListener('ended', () => {
      set((state) => ({
        activeTracks: state.activeTracks.map((t) =>
          t.trackId === trackId ? { ...t, playing: false, currentTime: 0 } : t
        ),
      }));
    });

    audioEl.addEventListener('durationchange', () => {
      set((state) => ({
        activeTracks: state.activeTracks.map((t) =>
          t.trackId === trackId ? { ...t, duration: audioEl.duration } : t
        ),
      }));
    });

    set((state) => ({ activeTracks: [...state.activeTracks, track] }));
    return trackId;
  },

  removeTrack: (trackId) => {
    const track = get().activeTracks.find((t) => t.trackId === trackId);
    if (track) {
      engine.removeTrack(trackId);
      if (track.objectUrl) URL.revokeObjectURL(track.objectUrl);
    }
    set((state) => ({
      activeTracks: state.activeTracks.filter((t) => t.trackId !== trackId),
    }));
  },

  togglePlay: async (trackId) => {
    await engine.ensureResumed();
    const track = engine.getTrack(trackId);
    const stateTrack = get().activeTracks.find((t) => t.trackId === trackId);
    if (!track || !stateTrack) return;

    if (stateTrack.playing) {
      track.pause();
    } else {
      await track.play();
    }
    set((state) => ({
      activeTracks: state.activeTracks.map((t) =>
        t.trackId === trackId ? { ...t, playing: !stateTrack.playing } : t
      ),
    }));
  },

  seek: (trackId, time) => {
    const track = engine.getTrack(trackId);
    if (track) track.seek(time);
  },
}));

export default usePlayerStore;
