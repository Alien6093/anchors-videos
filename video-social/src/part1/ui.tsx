import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT_DISPLAY, FONT_SANS } from '../components/theme';
import { AnchorsMark } from '../components/AnchorsLogo';
import { easeOut, prog } from '../lib/anim';

/** 0.55 -> 1 entry so a cut frame is never empty. */
export const enter = (f: number, dur = 6, from = 0.55): number => from + (1 - from) * prog(f, 0, dur, easeOut);

export const Photo: React.FC<{ file: string; size: number; radius?: number; ring?: string }> = ({ file, size, radius, ring }) => (
  <Img src={staticFile(file)} style={{ width: size, height: size, borderRadius: radius ?? size / 2, objectFit: 'cover', display: 'block', boxShadow: ring ? `0 0 0 4px ${ring}` : undefined, flex: 'none' }} />
);

export const Silhouette: React.FC<{ size: number; tone: number; radius?: number }> = ({ size, tone, radius }) => {
  const bg = ['#3a3836', '#44403c', '#34383b', '#403a38'][tone % 4];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', borderRadius: radius ?? size / 2, background: bg, flex: 'none' }}>
      <circle cx="50" cy="38" r="17" fill="#6b655d" />
      <path d="M16 100 C16 70 32 62 50 62 C68 62 84 70 84 100 Z" fill="#6b655d" />
    </svg>
  );
};

export const CreamCard: React.FC<{ children: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ children, pad = 44, style }) => (
  <div style={{ background: C.cream, borderRadius: 44, padding: pad, boxShadow: '0 30px 80px rgba(0,0,0,.55)', fontFamily: FONT_SANS, color: C.ink, ...style }}>{children}</div>
);

export const CardHeader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 42, fontWeight: 600, color: C.ink, fontFamily: FONT_SANS }}>
    <AnchorsMark size={46} />
    <span>anchors <span style={{ color: C.inkSoft }}>/</span> CLEO</span>
  </div>
);

export const PlanTitle: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <div style={{ fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.05, color: C.ink, letterSpacing: '-0.01em' }}>
    Campaign plan for <span style={{ color: C.red, fontStyle: 'italic' }}>Zeko AI</span>
  </div>
);

export const Tool: React.FC<{ label: string; done: boolean; t: number }> = ({ label, done, t }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.panel, border: `2px solid ${C.border}`, borderRadius: 44, padding: '20px 36px 20px 28px', fontFamily: FONT_SANS, fontSize: 42, color: C.text, alignSelf: 'flex-start', opacity: 0.55 + 0.45 * prog(t, 0, 6), transform: `translateY(${(1 - prog(t, 0, 6)) * 16}px)` }}>
    <AnchorsMark size={44} />
    <span style={{ fontWeight: 600, flex: 1, lineHeight: 1.2 }}>{label}</span>
    {done ? (
      <svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ) : (
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `rotate(${t * 18}deg)` }}><circle cx="12" cy="12" r="9" fill="none" stroke={C.muted} strokeWidth="3" strokeDasharray="14 42" strokeLinecap="round" /></svg>
    )}
  </div>
);

/** Typed text on fixed lines: hidden remainder keeps wrapping stable. */
export const TypedLines: React.FC<{ lines: readonly string[]; n: number; caret: boolean; size: number; color?: string }> = ({ lines, n, caret, size, color = C.text }) => {
  let start = 0;
  return (
    <div style={{ fontFamily: FONT_SANS, fontSize: size, lineHeight: 1.28, color, fontWeight: 500 }}>
      {lines.map((ln, i) => {
        const lineStart = start;
        start += ln.length + 1;
        const m = Math.max(0, Math.min(ln.length, n - lineStart));
        const isLast = i === lines.length - 1;
        const here = n >= lineStart && (n < lineStart + ln.length + 1 || isLast);
        return (
          <div key={i} style={{ whiteSpace: 'nowrap' }}>
            <span>{ln.slice(0, m)}</span>
            {caret && here ? <span style={{ display: 'inline-block', width: 5, height: size * 0.95, background: C.orange, marginLeft: 3, verticalAlign: 'text-bottom' }} /> : null}
            <span style={{ opacity: 0 }}>{ln.slice(m)}</span>
          </div>
        );
      })}
    </div>
  );
};
