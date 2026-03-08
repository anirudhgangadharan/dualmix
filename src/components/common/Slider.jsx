export default function Slider({ value, onChange, min = 0, max = 1, step = 0.01, className = '', color = '#8B5CF6' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-2 rounded-full appearance-none cursor-pointer touch-none ${className}`}
      style={{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #334155 ${pct}%, #334155 100%)`,
      }}
    />
  );
}
