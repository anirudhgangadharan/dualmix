import { useCallback } from 'react';
import { engine } from '../engine/AudioEngine.js';
import usePlayerStore from '../store/usePlayerStore.js';
import useMixerStore from '../store/useMixerStore.js';

export default function useAudioEngine() {
  const addTrack = usePlayerStore((s) => s.addTrack);
  const removeTrack = usePlayerStore((s) => s.removeTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const seek = usePlayerStore((s) => s.seek);
  const initChannel = useMixerStore((s) => s.initChannel);
  const removeChannel = useMixerStore((s) => s.removeChannel);

  const loadTrack = useCallback(
    async (fileInfo) => {
      engine.init();
      await engine.ensureResumed();
      const trackId = await addTrack(fileInfo);
      initChannel(trackId);
      return trackId;
    },
    [addTrack, initChannel]
  );

  const unloadTrack = useCallback(
    (trackId) => {
      removeTrack(trackId);
      removeChannel(trackId);
    },
    [removeTrack, removeChannel]
  );

  const setLoop = useCallback(
    (trackId, value) => {
      const stateTrack = usePlayerStore.getState().activeTracks.find((t) => t.trackId === trackId);
      if (stateTrack?.audioEl) {
        stateTrack.audioEl.loop = value;
      }
      useMixerStore.getState().toggleLoop(trackId);
    },
    []
  );

  return { loadTrack, unloadTrack, togglePlay, seek, setLoop };
}
