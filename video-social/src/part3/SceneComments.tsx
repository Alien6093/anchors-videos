import React from 'react';
import { C, FONT_SANS, FONT_SERIF } from '../components/theme';
import { lerp, pop, prog, easeInOut } from '../lib/anim';
import { Pill } from './kit';

const GROW_AT = 816;
const GROW_DUR = 46;
const NUM_AT = 864;
const SEGS = [
  { pct: 71, label: 'positive', color: C.green },
  { pct: 25, label: 'neutral', color: '#8d8b85' },
  { pct: 4, label: 'negative', color: '#E5604D' },
];

const Bar: React.FC<{ f: number }> = ({ f }) => {
  const t = prog(f, GROW_AT, GROW_DUR, easeInOut);
  const n = pop(f, NUM_AT, 14, 190);
  return (
    <div style={{ fontFamily: FONT_SANS, }}>
      <div style={{ height: 52, borderRadius: 26, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 4, width: `${t * 100}%`, height: '100%' }}>
          {SEGS.map((s) => <div key={s.label} style={{ flex: s.pct, background: s.color }} />)}
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: 16, height: 120, opacity: Math.min(1, n * 2), transform: `translateY(${lerp(14, 0, Math.min(1, n))}px)` }}>
        {SEGS.map((s) => (
          <div key={s.label} style={{ flex: s.pct === 71 ? 1.2 : 1, textAlign: 'center', lineHeight: 1.05 }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: s.color === '#8d8b85' ? '#cfcdc7' : s.color }}>{s.pct}%</div>
            <div style={{ fontSize: 44, fontWeight: 600, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Quote: React.FC<{ f: number; at: number; name: string; text: string; kind: 'positive' | 'negative' }> = ({ f, at, name, text, kind }) => {
  const p = pop(f, at, 14, 180);
  const col = kind === 'positive' ? C.green : '#E5604D';
  return (
    <div style={{ boxSizing: 'border-box', background: C.panel, border: `1.5px solid ${C.border}`, borderLeft: `8px solid ${col}`, borderRadius: 28, padding: '26px 32px 30px', fontFamily: FONT_SANS, transform: `translateX(${lerp(40, 0, Math.min(1, p))}px)`, boxShadow: '0 20px 50px rgba(0,0,0,.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: C.bubble, color: '#fff', fontSize: 38, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{name[0]}</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: '#fff', flex: 1 }}>{name}</div>
        <Pill size={40} color={col} bg={`${col}26`}>{kind === 'positive' ? 'Positive' : 'Negative'}</Pill>
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 58, lineHeight: 1.28, color: '#fff' }}>&ldquo;{text}&rdquo;</div>
    </div>
  );
};

/** f 810-989: sentiment bar grows without digits, numbers land on f864, then one quote at a time (hard swap on f930). */
export const SceneComments: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
    <Bar f={f} />
    <div style={{ minHeight: 380 }}>
      {f >= 870 && f < 930 && <Quote f={f} at={870} name="Neha K." kind="positive" text="Our debriefs end exactly like this." />}
      {f >= 930 && <Quote f={f} at={930} name="Sandeep R." kind="negative" text="Verified capability sounds good, but who validates the validation?" />}
    </div>
  </div>
);
