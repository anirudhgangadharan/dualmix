export default function Button({ children, onClick, active, variant = 'default', className = '', ...props }) {
  const base = 'px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-150 select-none touch-manipulation';
  const variants = {
    default: active
      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 active:bg-slate-500',
    left: active
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
      : 'bg-slate-700 text-blue-400 hover:bg-slate-600',
    right: active
      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
      : 'bg-slate-700 text-red-400 hover:bg-slate-600',
    both: active
      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
      : 'bg-slate-700 text-violet-400 hover:bg-slate-600',
    danger: 'bg-slate-700 text-slate-400 hover:bg-red-900/50 hover:text-red-400',
    primary: 'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700',
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
