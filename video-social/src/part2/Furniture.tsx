import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { lerp, prog, pop } from '../lib/anim';
import { CHIP_DATES } from './tokens';
import { useL } from './layout';

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 40;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px 700px at ${50 + drift / 20}% 38%, rgba(232,116,59,.10), transparent 70%), radial-gradient(1200px 900px at 50% 100%, rgba(0,0,0,.45), transparent 70%)` }} />
    </AbsoluteFill>
  );
};

export const PartChip: React.FC = () => {
  const L = useL();
  const fs = L.chipFont;
  return (
    <div style={{
      position: 'absolute', left: L.chipX, top: L.chipY, height: fs * 1.55, display: 'flex', alignItems: 'center', gap: fs * 0.5,
      padding: `0 ${fs * 0.6}px`, borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '2px solid rgba(255,255,255,.18)',
      fontFamily: FONT_SANS, fontWeight: 800, fontSize: fs, letterSpacing: '0.04em', color: '#fff', whiteSpace: 'nowrap',
    }}>
      <span>PART 2 / 3</span>
      <span style={{ color: C.orange }}>REVIEW</span>
    </div>
  );
};

const CalIcon: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

/** Corner date chip, global layer; pops only when its text changes. */
export const DateLayer: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const cur = CHIP_DATES.find((d) => f >= d.from && f < d.to);
  if (!cur) return null;
  const fs = L.chipFont;
  const p = pop(f - cur.from, 0, 12, 170);
  return (
    <div style={{
      position: 'absolute', right: L.W - (L.W - L.margin), top: L.chipY, height: fs * 1.55, display: 'flex', alignItems: 'center', gap: fs * 0.3,
      padding: `0 ${fs * 0.55}px`, borderRadius: 999, background: C.cream, color: C.ink, fontFamily: FONT_SANS, fontWeight: 800, fontSize: fs,
      whiteSpace: 'nowrap', transform: `scale(${lerp(0.8, 1, Math.min(1, p))})`, transformOrigin: '100% 50%', boxShadow: '0 10px 30px rgba(0,0,0,.4)',
    }}>
      <CalIcon s={fs * 0.9} />{cur.text}
    </div>
  );
};

type CapProps = { f: number; l916: string[]; l45: string[]; acc916: string; acc45: string; only?: '916' | '45' };

const renderLine = (line: string, accent: string, key: number) => (
  <div key={key} style={{ whiteSpace: 'nowrap' }}>
    {line.split(' ').map((w, i, a) => (
      <React.Fragment key={i}>
        <span style={{ color: w.replace(/[.,?!]/g, '') === accent.replace(/[.,?!]/g, '') ? C.orange : '#fff' }}>{w}</span>{i < a.length - 1 ? ' ' : ''}
      </React.Fragment>
    ))}
  </div>
);

/** 9:16 kinetic caption / 4:5 headline. Fully present from its first frame. */
export const Cap: React.FC<CapProps> = ({ f, l916, l45, acc916, acc45, only }) => {
  const L = useL();
  if (only && only !== L.fmt) return null;
  if (L.fmt === '916') {
    const sc = lerp(1.08, 1, prog(f, 0, 6));
    return (
      <div style={{ position: 'absolute', left: L.margin, width: L.W - 2 * L.margin, top: L.capTop, height: L.capH, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: '-0.025em', transform: `scale(${sc})`, textShadow: '0 4px 24px rgba(0,0,0,.55)' }}>
        <div>{l916.map((l, i) => renderLine(l, acc916, i))}</div>
      </div>
    );
  }
  const sc = lerp(1.03, 1, prog(f, 0, 6));
  return (
    <div style={{ position: 'absolute', left: L.margin, width: L.W - 2 * L.margin, top: L.capTop, height: L.capH, display: 'flex', alignItems: 'center', fontFamily: FONT_SANS, fontWeight: 700, fontSize: 60, lineHeight: 1.16, letterSpacing: '-0.025em', transform: `scale(${sc})`, transformOrigin: '0% 50%', textShadow: '0 3px 18px rgba(0,0,0,.5)' }}>
      <div>{l45.map((l, i) => renderLine(l, acc45, i))}</div>
    </div>
  );
};

/** Loop seam: last 6 frames dip to near-black with a 10% orange glow, landing on f0. */
export const LoopDip: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 1434, 5, (x) => x);
  const a = f >= 1434 ? 0.35 + 0.55 * t : 0;
  const pre = f >= 1318 && f < 1320 ? 0.55 : 0;
  const o = Math.max(a, pre);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(232,116,59,${0.1 * o}), transparent 60%), rgba(8,7,7,${o})`, pointerEvents: 'none' }} />
  );
};
