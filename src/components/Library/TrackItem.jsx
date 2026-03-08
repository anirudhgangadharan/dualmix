export default function TrackItem({ file, onAdd }) {
  const name = file.name.replace(/\.[^.]+$/, '');
  return (
    <button
      onClick={() => onAdd(file)}
      className="w-full text-left px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-600/70 transition-colors group flex items-center gap-2 touch-manipulation"
    >
      <span className="text-violet-400 text-lg shrink-0">+</span>
      <span className="text-slate-200 text-sm truncate">{name}</span>
      <span className="text-slate-500 text-xs ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.path !== file.name ? file.path : ''}
      </span>
    </button>
  );
}
