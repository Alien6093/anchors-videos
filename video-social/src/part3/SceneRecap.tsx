import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';

const ROWS = [
  { n: '1', word: 'Build', at: 1170 },
  { n: '2', word: 'Review', at: 1200 },
  { n: '3', word: 'Monitor', at: 1230 },
];
const ALL_AT = 1260;

/** f 1170-1319: the three series stages light up one per beat pair (b78 / b80 / b82), all lit on b84. */
export const SceneRecap: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, fontFamily: FONT_SANS }}>
    {ROWS.map((r) => {
      const p = pop(f, r.at, 12, 200);
      const lit = f >= r.at;
      const all = prog(f, ALL_AT, 10);
      return (
        <div key={r.word} style={{
          display: 'flex', alignItems: 'center', gap: 32, height: 168, boxSizing: 'border-box', padding: '0 40px', borderRadius: 36,
          background: lit ? C.cream : C.panel, border: `2px solid ${lit ? C.cream : C.border}`, transform: `scale(${lit ? lerp(1.06, 1, Math.min(1, p)) : 1})`,
          boxShadow: lit ? `0 0 ${30 + 40 * all}px rgba(251,247,241,${0.14 + 0.14 * all})` : undefined,
        }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, background: lit ? C.ink : C.bubble, color: lit ? C.cream : C.muted, fontSize: 52, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.n}</div>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: '-0.03em', color: lit ? C.ink : '#6d6b66', flex: 1 }}>{r.word}</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: lit ? C.greenDeep : 'transparent' }}>&#10003;</div>
        </div>
      );
    })}
  </div>
);
