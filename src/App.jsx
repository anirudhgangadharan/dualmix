import { useState, useEffect, useCallback } from 'react';
import useAudioEngine from './hooks/useAudioEngine.js';
import usePlayerStore from './store/usePlayerStore.js';
import MixerPanel from './components/Mixer/MixerPanel.jsx';
import LibraryPanel from './components/Library/LibraryPanel.jsx';

function updateMediaSession(activeTracks) {
  if (!('mediaSession' in navigator)) return;
  const playing = activeTracks.filter((t) => t.playing);
  if (playing.length === 0) {
    navigator.mediaSession.metadata = null;
    return;
  }
  const names = playing.map((t) => t.fileInfo.name.replace(/\.[^.]+$/, ''));
  navigator.mediaSession.metadata = new MediaMetadata({
    title: names.length === 1 ? names[0] : `${names.length} tracks playing`,
    artist: 'DualMix',
  });
}

export default function App() {
  const { loadTrack } = useAudioEngine();
  const activeTracks = usePlayerStore((s) => s.activeTracks);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const [libraryOpen, setLibraryOpen] = useState(true);

  const handleAddTrack = useCallback(
    async (fileInfo) => {
      await loadTrack(fileInfo);
    },
    [loadTrack]
  );

  // Media Session API
  useEffect(() => {
    updateMediaSession(activeTracks);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        activeTracks.forEach((t) => {
          if (!t.playing) togglePlay(t.trackId);
        });
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        activeTracks.forEach((t) => {
          if (t.playing) togglePlay(t.trackId);
        });
      });
    }
  }, [activeTracks, togglePlay]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center text-[10px] font-bold">
            DM
          </div>
          <h1 className="text-base font-semibold text-slate-100">DualMix</h1>
        </div>
        <button
          onClick={() => setLibraryOpen((o) => !o)}
          className="text-slate-400 hover:text-slate-200 text-sm px-2 py-1 rounded transition-colors"
        >
          {libraryOpen ? 'Hide Library' : 'Show Library'}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <MixerPanel />

        {libraryOpen && (
          <div className="border-t border-slate-700/50 pt-4">
            <LibraryPanel onAddTrack={handleAddTrack} />
          </div>
        )}
      </main>
    </div>
  );
}
