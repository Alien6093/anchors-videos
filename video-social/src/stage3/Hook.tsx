import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Format } from '../lib/format';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { Backdrop } from './Backdrop';
import { ACCENT, T } from './tokens';

const SHADOW = '0 6px 18px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.5)';
const POP_A = 4;
const POP_B = 22;

/** Emphasis bump (1 -> 1.07 -> 1) starting at a frame; text is already legible from frame 0 (cover frame). */
const bump = (f: number, at: number): number => {
  const p = pop(f - at, 0, 8, 260, 0.5);
  return f < at ? 1 : lerp(1.0, 1.0, p) + 0.07 * Math.max(0, 1 - Math.abs(p - 1) * 2.2) * (f - at < 14 ? 1 : 0);
};

const Hook916: React.FC<{ frame: number }> = ({ frame }) => {
  const out = 1 - prog(frame, T.hookEnd - 3, 3);
  const line: React.CSSProperties = { fontFamily: FONT_SANS, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#fff', textShadow: SHADOW, textAlign: 'center' };
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 290, opacity: out, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ ...line, fontSize: 104, transform: `scale(${bump(frame, POP_A)})` }}>8 creators.</div>
      <div style={{ ...line, fontSize: 158, color: ACCENT, transform: `scale(${bump(frame, POP_B)})`, textShadow: `0 0 50px rgba(242,128,58,.5), ${SHADOW}` }}>2,80,000</div>
      <div style={{ ...line, fontSize: 104, transform: `scale(${bump(frame, POP_B + 3)})` }}>impressions.</div>
    </div>
  );
};

const Hook45: React.FC<{ frame: number }> = ({ frame }) => {
  const out = 1 - prog(frame, T.hookEnd - 3, 3);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 80, opacity: out, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', textShadow: SHADOW }}>
      8 creators. <span style={{ color: ACCENT }}>2,80,000 impressions.</span> One chat.
    </div>
  );
};

/** Hook text over the freeze/re-race (frames 0-47). Frame 0 already carries the full claim. */
export const HookText: React.FC<{ format: Format; frame: number }> = ({ format, frame }) =>
  format === '916' ? <Hook916 frame={frame} /> : <Hook45 frame={frame} />;

/** "Every number. One chat." slam on black (frames 48-63). Also the loop key. */
export const HookBlack: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const local = frame - T.hookEnd;
  const p = pop(local, 0, 11, 240, 0.5);
  const size = format === '916' ? 132 : 92;
  const cy = format === '916' ? 860 : 640;
  const line: React.CSSProperties = { fontFamily: FONT_SANS, fontWeight: 900, fontSize: size, letterSpacing: '-0.04em', lineHeight: 1.02, textAlign: 'center', textShadow: SHADOW };
  const p2 = pop(local, 4, 11, 240, 0.5);
  const one = (q: number): React.CSSProperties => ({ opacity: Math.min(1, q * 4), transform: `scale(${lerp(0.6, 1, Math.min(q, 1.1))})` });
  return (
    <AbsoluteFill>
      <Backdrop cyPct={(cy / (format === '916' ? 1920 : 1350)) * 100} strength={0.3 * prog(local, 0, 6, easeOut)} />
      <div style={{ position: 'absolute', left: 60, right: 60, top: cy, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ ...line, color: '#fff', ...one(p) }}>Every number.</div>
        <div style={{ ...line, color: ACCENT, ...one(p2) }}>One chat.</div>
      </div>
    </AbsoluteFill>
  );
};
