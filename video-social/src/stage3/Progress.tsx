import React from 'react';
import { Format } from '../lib/format';
import { lerp, prog } from '../lib/anim';
import { ACCENT, T, TOTAL_FRAMES } from './tokens';

const BAR_TOP: Record<Format, number> = { '916': 1440, '45': 1264 };
const BAR_W = 920;
const BAR_H = 6;
const SHIFT = 8;

/** 6px progress bar, white 85% over a 25% track; turns orange during the crest (S5). */
export const Progress: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const pct = Math.min(1, frame / (TOTAL_FRAMES - 1));
  const orange = Math.min(prog(frame, T.s5, SHIFT), 1 - prog(frame, T.s6 - SHIFT, SHIFT));
  const fill = `rgb(${lerp(255, 242, orange)},${lerp(255, 128, orange)},${lerp(255, 58, orange)})`;
  return (
    <div style={{ position: 'absolute', left: 80, top: BAR_TOP[format], width: BAR_W, height: BAR_H, borderRadius: 3, background: 'rgba(255,255,255,.25)' }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 3, background: fill, opacity: 0.85 + 0.15 * orange }} />
    </div>
  );
};
