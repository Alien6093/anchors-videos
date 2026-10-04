import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog, easeInOut } from '../lib/anim';
import { Bubble, ToolLine } from './kit';
import { useLay } from './base';

const CARD_AT = 1020;
const TOGGLE_AT = 1086;
const BAR_REACHED = 0.41;
const BAR_COMMENTERS = 0.47;

const Toggle: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, TOGGLE_AT - 4, 10, easeInOut);
  const W = 340;
  return (
    <div style={{ display: 'flex', alignSelf: 'center', background: '#2f2e2b', border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 8, position: 'relative', fontFamily: FONT_SANS, fontSize: 44, fontWeight: 700 }}>
      <div style={{ position: 'absolute', top: 8, bottom: 8, left: 8 + k * W, width: W, background: C.cream, borderRadius: 17 }} />
      {['Reached', 'Commenters'].map((l, i) => (
        <div key={l} style={{ width: W, textAlign: 'center', padding: '10px 0', position: 'relative', color: Math.abs(k - i) < 0.5 ? C.ink : C.muted }}>{l}</div>
      ))}
    </div>
  );
};

/** One focal number. 41% swaps to 47% on the toggle (never both on screen); the bar morphs, the label becomes the sentence. */
const RolesPanel: React.FC<{ f: number }> = ({ f }) => {
  const { dw } = useLay();
  const p = pop(f, CARD_AT, 14, 180);
  const after = f >= TOGGLE_AT;
  const bar = lerp(BAR_REACHED, BAR_COMMENTERS, prog(f, TOGGLE_AT, 14, easeInOut)) * 2;
  const punch = after ? Math.max(0, 1 - (f - TOGGLE_AT) / 10) : 0;
  const barP = prog(f, CARD_AT + 6, 18);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, fontFamily: FONT_SANS, transform: `translateY(${lerp(30, 0, Math.min(1, p))}px)` }}>
      <div style={{ textAlign: 'center', fontSize: 44, fontWeight: 800, letterSpacing: '0.12em', color: C.muted }}>ROLES</div>
      <Toggle f={f} />
      <div style={{ textAlign: 'center', fontSize: 210, fontWeight: 800, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1.0, transform: `scale(${1 + 0.1 * punch})`, textShadow: after ? `0 0 ${40 * punch}px rgba(251,247,241,.5)` : undefined }}>{after ? '47%' : '41%'}</div>
      <div style={{ width: dw, height: 52, borderRadius: 26, background: 'rgba(255,255,255,.09)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(1, bar) * barP * 100}%`, height: '100%', borderRadius: 26, background: C.cream }} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 48, fontWeight: 600, color: '#e9e5de', lineHeight: 1.2, minHeight: 116 }}>
        {after ? <>Commenters skew<br />HR Manager / Talent Acquisition.</> : <>Reached:<br />HR Manager / Talent Acquisition</>}
      </div>
    </div>
  );
};

/** f 990-1169: bubble + tool line, then the Roles panel (41% reached -> 47% commenters). */
export const SceneAudience: React.FC<{ f: number }> = ({ f }) => {
  if (f >= CARD_AT) return <RolesPanel f={f} />;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>
      <Bubble instant f={f} at={990} text="Who did it reach?" size={72} />
      <div style={{ opacity: prog(f, 1000, 8) }}><ToolLine f={f} at={1000} doneAt={1014} text="Who it reached" size={44} /></div>
    </div>
  );
};
