import React from 'react';
import { Img, staticFile } from 'remotion';
import { AnchorsMark } from '../components/AnchorsLogo';
import { C, FONT_SANS, FONT_SERIF } from '../components/theme';
import { lerp, prog, pop } from '../lib/anim';
import { CREATORS } from './data';

export const ease = (t: number): number => t;

export const Avatar: React.FC<{ k: string; size: number }> = ({ k, size }) => (
  <Img src={staticFile(CREATORS[k].photo)} style={{ width: size, height: size, borderRadius: size / 2, objectFit: 'cover', display: 'block', flex: 'none' }} />
);

export const Pill: React.FC<{ children: React.ReactNode; color: string; bg: string; size: number; dot?: boolean; style?: React.CSSProperties }> = ({ children, color, bg, size, dot, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, fontFamily: FONT_SANS, fontWeight: 700, fontSize: size, color, background: bg, padding: `${size * 0.2}px ${size * 0.55}px`, borderRadius: 999, whiteSpace: 'nowrap', lineHeight: 1.1, ...style }}>
    {dot && <span style={{ width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: color, boxShadow: `0 0 ${size * 0.3}px ${color}` }} />}
    {children}
  </div>
);

/** User chat bubble, right aligned. Fully opaque from `at`, only scale/position animate. */
export const Bubble: React.FC<{ f: number; at: number; text: string; size: number; instant?: boolean }> = ({ f, at, text, size, instant }) => {
  const p = pop(f, at, 14, 170);
  const o = instant ? 1 : prog(f, at, 6);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: C.bubble, color: '#fff', fontFamily: FONT_SANS, fontSize: size, fontWeight: 600, lineHeight: 1.15, padding: `${size * 0.3}px ${size * 0.5}px`, borderRadius: size * 0.7,
        borderBottomRightRadius: size * 0.2, opacity: o, transform: `translateY(${lerp(36, 0, Math.min(1, p))}px) scale(${lerp(0.92, 1, Math.min(1, p))})`, transformOrigin: '100% 100%', border: `1.5px solid ${C.border}`,
      }}>{text}</div>
    </div>
  );
};

/** "anchors CLEO - <text>" tool line with spinner turning into a check. */
export const ToolLine: React.FC<{ f: number; at: number; doneAt: number; text: string; size: number }> = ({ f, at, doneAt, text, size }) => {
  const p = prog(f, at, 10);
  const done = f >= doneAt;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, fontFamily: FONT_SANS, fontSize: size, color: C.text, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: size * 0.6, padding: `${size * 0.3}px ${size * 0.55}px`, opacity: p, transform: `translateY(${lerp(20, 0, p)}px)` }}>
      <AnchorsMark size={size * 0.8} />
      <span><b style={{ color: '#fff' }}>CLEO</b> <span style={{ color: C.muted }}>·</span> {text}</span>
      {done
        ? <span style={{ color: C.green, fontWeight: 800 }}>&#10003;</span>
        : <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', border: `${Math.max(3, size * 0.09)}px solid ${C.orange}`, borderTopColor: 'transparent', transform: `rotate(${f * 24}deg)` }} />}
    </div>
  );
};

export const SerifLine: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <div style={{ fontFamily: FONT_SERIF, fontSize: size, lineHeight: 1.32, color: '#fff', ...style }}>{children}</div>
);

/** Absolutely positioned metric tile; label on top, value below, both centred. */
export const Tile: React.FC<{ top: number; left: number; width: number; height: number; label: string; value: string; labelSize?: number; valueSize: number; appear?: number; hot?: boolean }> = ({ top, left, width, height, label, value, labelSize = 44, valueSize, appear = 1, hot }) => (
  <div style={{
    position: 'absolute', top, left, width, height, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
    background: C.panel, border: `2px solid ${hot ? 'rgba(251,247,241,.55)' : C.border}`, borderRadius: 28, fontFamily: FONT_SANS,
    opacity: Math.min(1, appear * 1.6), transform: `translateY(${lerp(34, 0, Math.min(1, appear))}px) scale(${lerp(0.94, 1, Math.min(1, appear))})`,
  }}>
    <div style={{ fontSize: labelSize, color: C.muted, fontWeight: 600, lineHeight: 1.1 }}>{label}</div>
    <div style={{ fontSize: valueSize, color: '#fff', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
  </div>
);
