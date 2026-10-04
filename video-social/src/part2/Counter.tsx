import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { lerp, prog } from '../lib/anim';
import { useS } from './layout';

/** "n of 8" counter: hard digit swap with a pop, never a crossfade. */
export const CounterOf8: React.FC<{ n: number; since: number; size: number; gold?: boolean }> = ({ n, since, size, gold }) => {
  const s = useS();
  const t = prog(since, 0, 7);
  const sc = lerp(1.18, 1, t);
  const col = gold ? '#F5C451' : '#fff';
  return (
    <div style={{
      fontFamily: FONT_SANS, fontWeight: 900, fontSize: s(size), letterSpacing: '-0.04em', lineHeight: 1, textAlign: 'center', color: col,
      transform: `scale(${sc})`, textShadow: gold ? '0 0 60px rgba(245,196,81,.55)' : undefined, whiteSpace: 'nowrap',
    }}>
      {n} <span style={{ color: gold ? '#F5C451' : C.muted, fontWeight: 700, fontSize: '0.62em', letterSpacing: '-0.01em' }}>of</span> 8
    </div>
  );
};

/** 8-segment progress bar (no digits). */
export const SegBar: React.FC<{ filled: number; gold?: boolean }> = ({ filled, gold }) => {
  const s = useS();
  return (
    <div style={{ display: 'flex', gap: s(10) }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ flex: 1, height: s(18), borderRadius: s(9), background: i < filled ? (gold ? '#F5C451' : C.green) : 'rgba(255,255,255,.12)' }} />
      ))}
    </div>
  );
};
