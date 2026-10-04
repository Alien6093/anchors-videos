import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { lerp, prog } from '../anim';

const ROWS: [string, string, string][] = [
  ['Creators', '16', '8'],
  ['Budget', 'Rs 3,00,000', 'Rs 1,50,000'],
  ['Projected impressions', '5.42-5.58 lakh', '2.69-2.77 lakh'],
  ['Max spend', 'Rs 3,01,388', 'Rs 1,49,712'],
];

/** Before/after table: "after" cells overwrite the "before" values left to right (rows staggered), flash orange and settle. */
export const BeforeAfter: React.FC<{ at: number; overwriteAt: number }> = ({ at, overwriteAt }) => {
  const f = useCurrentFrame();
  const enter = prog(f, at, 14);
  return (
    <div style={{ background: C.cream, borderRadius: 18, fontFamily: FONT_SANS, overflow: 'hidden', opacity: enter, transform: `translateY(${lerp(30, 0, enter)}px)`, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>
      <div style={{ display: 'flex', padding: '14px 34px', fontSize: 24, color: C.inkSoft, background: C.creamHead, borderBottom: `1px solid ${C.creamLine}` }}>
        <div style={{ width: 370 }} /><div style={{ width: 300 }}>Before</div><div style={{ width: 60 }} /><div>After</div>
      </div>
      {ROWS.map(([l, b, a], i) => {
        const w = prog(f, overwriteAt + i * 12, 8);
        const flash = prog(f, overwriteAt + i * 12 + 6, 4) * (1 - prog(f, overwriteAt + i * 12 + 22, 24));
        return (
          <div key={l} style={{ display: 'flex', alignItems: 'center', padding: '14px 34px', borderBottom: i < 3 ? `1px solid ${C.creamLine}` : undefined, fontSize: 30, color: C.ink }}>
            <div style={{ width: 370, color: C.inkSoft }}>{l}</div>
            <div style={{ width: 300, opacity: 0.55 - 0.25 * w, textDecoration: w > 0.5 ? 'line-through' : undefined }}>{b}</div>
            <div style={{ width: 60, color: C.red, opacity: w }}>{'->'}</div>
            <div style={{ position: 'relative', fontWeight: 700, color: flash > 0.02 ? C.orange : C.ink, transform: `scale(${1 + 0.08 * flash})`, transformOrigin: 'left center', opacity: w, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{a}</div>
          </div>
        );
      })}
    </div>
  );
};
