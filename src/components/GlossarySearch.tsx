"use client";

interface GlossarySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function GlossarySearch({ value, onChange }: GlossarySearchProps) {
  return (
    <label>
      Search glossary
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
