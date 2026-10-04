import React from 'react';
import { useCurrentFrame } from 'remotion';
import { easeInOut, prog } from '../anim';

/** Vertical number roll from `from` down to `to` (integers) between start and start+dur. */
export const Odometer: React.FC<{ from: number; to: number; start: number; dur?: number; size: number; color?: string; weight?: number }> = ({ from, to, start, dur = 26, size, color = 'inherit', weight = 700 }) => {
  const f = useCurrentFrame();
  const n = from - to;
  const t = prog(f, start, dur, easeInOut) * n;
  const h = size * 1.15;
  const vals = Array.from({ length: n + 1 }, (_, i) => from - i);
  return (
    <span style={{ display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'bottom', fontSize: size, lineHeight: `${h}px`, color, fontWeight: weight, fontVariantNumeric: 'tabular-nums' }}>
      <span style={{ display: 'block', transform: `translateY(${-t * h}px)` }}>
        {vals.map((v) => <span key={v} style={{ display: 'block', height: h, textAlign: 'center' }}>{v}</span>)}
      </span>
    </span>
  );
};
