import useMixerStore from '../../store/useMixerStore.js';
import usePlayerStore from '../../store/usePlayerStore.js';
import useAudioEngine from '../../hooks/useAudioEngine.js';
import Slider from '../common/Slider.jsx';
import Button from '../common/Button.jsx';

function formatTime(s) {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function ChannelStrip({ trackId }) {
  const track = usePlayerStore((s) => s.activeTracks.find((t) => t.trackId === trackId));
  const channel = useMixerStore((s) => s.channels[trackId]);
  const setRouting = useMixerStore((s) => s.setRouting);
  const setVolume = useMixerStore((s) => s.setVolume);
  const { unloadTrack, togglePlay, seek } = useAudioEngine();

  if (!track || !channel) return null;

  const name = track.fileInfo.name.replace(/\.[^.]+$/, '');
  const routing = channel.routing;
  const vol = channel.volume;

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 flex flex-col gap-3 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-200 text-sm font-medium truncate flex-1 mr-2">{name}</h3>
        <button
          onClick={() => unloadTrack(trackId)}
          className="text-slate-500 hover:text-red-400 text-lg leading-none transition-colors p-1"
          title="Remove track"
        >
          &times;
        </button>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => togglePlay(trackId)}
          className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 flex items-center justify-center text-white transition-colors shrink-0"
        >
          {track.playing ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <rect x="1" y="1" width="4" height="14" rx="1" />
              <rect x="9" y="1" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <path d="M2 1.5v13l11-6.5z" />
            </svg>
          )}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <Slider
            value={track.currentTime}
            max={track.duration || 1}
            step={0.1}
            onChange={(v) => seek(trackId, v)}
            color="#8B5CF6"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formatTime(track.currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-xs w-8">Ear</span>
        <div className="flex gap-1 flex-1">
          <Button variant="left" active={routing === 'left'} onClick={() => setRouting(trackId, 'left')} className="flex-1">
            L
          </Button>
          <Button variant="both" active={routing === 'both'} onClick={() => setRouting(trackId, 'both')} className="flex-1">
            Both
          </Button>
          <Button variant="right" active={routing === 'right'} onClick={() => setRouting(trackId, 'right')} className="flex-1">
            R
          </Button>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-xs w-8">Vol</span>
        <Slider value={vol} onChange={(v) => setVolume(trackId, v)} color="#8B5CF6" />
        <span className="text-slate-400 text-xs w-8 text-right">{Math.round(vol * 100)}%</span>
      </div>

      {/* Visual indicator */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-150"
            style={{ width: `${(routing === 'right' ? 0 : vol) * 100}%` }}
          />
        </div>
        <span className="text-slate-600 text-[10px]">L</span>
        <span className="text-slate-600 text-[10px]">R</span>
        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-150"
            style={{ width: `${(routing === 'left' ? 0 : vol) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
