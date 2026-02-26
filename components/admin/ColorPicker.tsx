"use client";

import { useState, useEffect } from "react";
import { isValidHex, getContrastColor } from "@/lib/color-utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

export default function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
      <div className="relative flex-shrink-0">
        <input
          type="color"
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer bg-transparent"
          style={{ padding: 0 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <label className="text-sm font-semibold text-foreground block">{label}</label>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-28 px-3 py-2 text-sm font-mono border border-border rounded-lg bg-background-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        placeholder="#000000"
      />
      <div
        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: value, color: getContrastColor(value) }}
      >
        Aa
      </div>
    </div>
  );
}
