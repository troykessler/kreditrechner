import { useState, useEffect } from "react";

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
  const [draft, setDraft] = useState("");

  // When not focused, keep draft in sync with external value (e.g. slider changes)
  useEffect(() => {
    if (!focused) setDraft(value.toString());
  }, [value, focused]);

  const showUnit = !formatDisplay;
  const displayValue = focused ? draft : (formatDisplay ? formatDisplay(value) : value.toString());

  const commit = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.,]/g, "").replace(",", "."));
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setDraft(value.toString());
    setFocused(true);
    e.target.select();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    commit(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
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
            onFocus={handleFocus}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
