import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { lerp, prog } from '../anim';

const ROWS: [string, string][] = [
  ['Creator fees', 'Rs 1,13,251'], ['Platform fee', 'Rs 11,325'], ['Subtotal', 'Rs 1,24,576'], ['GST (18%)', 'Rs 22,424'],
];

/** Quote table. Rows above the total are dimmed once the total locks. */
export const QuoteTable: React.FC<{ at: number; totalAt: number }> = ({ at, totalAt }) => {
  const f = useCurrentFrame();
  const enter = prog(f, at, 12);
  const dimRows = prog(f, totalAt - 6, 10) * 0.55;
  const t = prog(f, totalAt, 10);
  const line = prog(f, totalAt + 4, 14);
  return (
    <div style={{ background: C.cream, borderRadius: 18, fontFamily: FONT_SANS, padding: '10px 36px 14px', opacity: enter, transform: `translateY(${lerp(30, 0, enter)}px)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>
      {ROWS.map(([l, v], i) => {
        const p = prog(f, at + 6 + i * 7, 10);
        return (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', fontSize: 31, color: C.ink, borderBottom: `1px solid ${C.creamLine}`, opacity: p * (1 - dimRows), transform: `translateX(${lerp(-24, 0, p)}px)` }}>
            <span style={{ color: C.inkSoft }}>{l}</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v}</span>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 10px', color: C.ink, opacity: t, transform: `scale(${lerp(0.96, 1, t)})`, transformOrigin: 'left center' }}>
        <span style={{ fontSize: 34, fontWeight: 700 }}>Total payable</span>
        <span style={{ position: 'relative', fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
          Rs 1,47,000
          <span style={{ position: 'absolute', left: 0, bottom: -4, height: 5, borderRadius: 3, background: C.orange, width: `${line * 100}%` }} />
        </span>
      </div>
    </div>
  );
};
