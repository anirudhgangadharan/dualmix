import usePlayerStore from '../../store/usePlayerStore.js';
import ChannelStrip from './ChannelStrip.jsx';

export default function MixerPanel() {
  const activeTracks = usePlayerStore((s) => s.activeTracks);

  if (activeTracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">No active tracks</p>
        <p className="text-slate-600 text-xs mt-1">Add songs from the library below</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
        Active Tracks
        <span className="text-slate-600 ml-2">{activeTracks.length}</span>
      </h2>
      {activeTracks.map((t) => (
        <ChannelStrip key={t.trackId} trackId={t.trackId} />
      ))}
    </div>
  );
}
