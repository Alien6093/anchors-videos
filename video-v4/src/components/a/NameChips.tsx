import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { lerp, prog } from '../anim';

export const DROPPED = ['Siddharth Jogani', 'Piyush Bathwal', 'Mayank Jain', 'Harshdeep Saxena', 'Raghav Jhawar', 'Arijit Ghosh', 'Ajay Kumar', 'Vivekananda Sinha'];

/** 8 neutral name chips in two columns; fade in as one block. */
export const NameChips: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '18px 0', opacity: p, transform: `translateY(${lerp(20, 0, p)}px)` }}>
      {DROPPED.map((n) => (
        <div key={n} style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.text, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '11px 28px' }}>{n}</div>
      ))}
    </div>
  );
};
