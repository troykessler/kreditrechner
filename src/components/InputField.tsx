import { useState } from "react";

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
  const [focused, setFocused] = useState(false);

  // When focused: show raw number for easy editing. When blurred: show formatted value.
  const displayValue = focused ? value.toString() : (formatDisplay ? formatDisplay(value) : value.toString());
  // Hide unit label when formatDisplay already embeds the unit
  const showUnit = !formatDisplay;

  const handleChange = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.,]/g, "").replace(",", "."));
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  };

  const handleBlur = (raw: string) => {
    setFocused(false);
    handleChange(raw);
  };

  return (
    <div className="input-field">
      <div className="input-header">
        <label className="input-label">{label}</label>
        <div className="input-value-group">
          <input
            type="text"
            className="input-number"
            value={displayValue}
            onFocus={(e) => { setFocused(true); e.target.select(); }}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
          />
          {showUnit && <span className="input-unit">{unit}</span>}
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
