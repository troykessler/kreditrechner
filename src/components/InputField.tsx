interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  formatDisplay?: (v: number) => string;
}

export default function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  formatDisplay,
}: InputFieldProps) {
  const display = formatDisplay ? formatDisplay(value) : value.toString();

  const handleInput = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.,]/g, "").replace(",", "."));
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="input-field">
      <div className="input-header">
        <label className="input-label">{label}</label>
        <div className="input-value-group">
          <input
            type="text"
            className="input-number"
            value={display}
            onChange={(e) => handleInput(e.target.value)}
          />
          <span className="input-unit">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        className="input-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="slider-bounds">
        <span>{formatDisplay ? formatDisplay(min) : `${min} ${unit}`}</span>
        <span>{formatDisplay ? formatDisplay(max) : `${max} ${unit}`}</span>
      </div>
    </div>
  );
}
