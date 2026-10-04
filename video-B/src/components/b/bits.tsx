import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { lerp, pop, prog } from '../anim';

/** Margin caption: sits in the top band (over the chat header), never over UI. */
export const Caption: React.FC<{ text: string; at: number; out?: number; size?: number }> = ({ text, at, out, size = 64 }) => {
  const f = useCurrentFrame();
  const i = prog(f, at, 10);
  const o = out === undefined ? 0 : prog(f, out, 8);
  const a = i * (1 - o);
  if (a <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: a }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 160, background: `linear-gradient(to bottom, ${C.bg} 62%, rgba(31,30,29,0))` }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 800, fontSize: size,
        letterSpacing: '-0.035em', color: '#fff', transform: `translateY(${lerp(16, 0, i)}px)`, lineHeight: 1.1,
      }}>{text}</div>
    </AbsoluteFill>
  );
};

/** Corner date chip (timeline). */
export const DateChip: React.FC<{ label: string; at?: number; top?: number }> = ({ label, at = 0, top = 104 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 10, 200, 0.6);
  return (
    <div style={{
      position: 'absolute', right: 44, top, display: 'flex', alignItems: 'center', gap: 14, background: C.cream, color: C.ink,
      fontFamily: FONT_SANS, fontWeight: 700, fontSize: 32, padding: '12px 24px 12px 16px', borderRadius: 18,
      boxShadow: '0 16px 40px rgba(0,0,0,.45)', opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.4, 1, p)}) rotate(${lerp(-6, 0, p)}deg)`, zIndex: 40,
    }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
      {label}
    </div>
  );
};

export const Tick: React.FC<{ p: number; size?: number; color?: string; filled?: boolean }> = ({ p, size = 36, color = C.green, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {filled && <circle cx="12" cy="12" r="11" fill={`${color}33`} opacity={Math.min(1, p * 2)} />}
    <path d="M6 12.5l4 4L18 8" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={20 * (1 - p)} />
  </svg>
);

export const Cross: React.FC<{ p: number; size?: number }> = ({ p, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, transform: `scale(${lerp(1.5, 1, Math.min(1, p))})`, opacity: Math.min(1, p * 2) }}>
    <circle cx="12" cy="12" r="11" fill="rgba(229,96,77,.22)" />
    <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="#E5604D" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

/** Text with underlined flaw / highlight phrases that draw in. */
export const MarkedText: React.FC<{ text: string; marks: string[]; at: number; gap?: number; color?: string; tint?: string }> = ({ text, marks, at, gap = 10, color = C.red, tint = 'rgba(214,58,47,.12)' }) => {
  const f = useCurrentFrame();
  const ranges = marks.map((m, i) => ({ s: text.indexOf(m), e: text.indexOf(m) + m.length, i })).filter((r) => r.s >= 0).sort((a, b) => a.s - b.s);
  const out: React.ReactNode[] = [];
  let cur = 0;
  ranges.forEach((r) => {
    if (r.s > cur) out.push(<span key={`t${cur}`}>{text.slice(cur, r.s)}</span>);
    const p = prog(f, at + r.i * gap, 14);
    out.push(
      <span key={`m${r.s}`} style={{
        backgroundImage: `linear-gradient(${color},${color}), linear-gradient(${tint},${tint})`, backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 100%, 0 0', backgroundSize: `${p * 100}% 4px, ${p * 100}% 100%`, WebkitBoxDecorationBreak: 'clone', paddingBottom: 2,
      }}>{text.slice(r.s, r.e)}</span>,
    );
    cur = r.e;
  });
  if (cur < text.length) out.push(<span key="end">{text.slice(cur)}</span>);
  return <>{out}</>;
};

/** Dark scrim over the dimmed chat behind foreground widgets. */
export const Scrim: React.FC<{ at?: number; a?: number }> = ({ at = 0, a = 0.72 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `rgba(31,30,29,${a * prog(f, at, 10)})` }} />;
};

export const Dm: React.FC<{ o: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ o, children, style }) => (
  <div style={{ opacity: o, ...style }}>{children}</div>
);

export const GoldFlash: React.FC<{ at: number; dur?: number }> = ({ at, dur = 26 }) => {
  const f = useCurrentFrame();
  const t = prog(f, at, dur);
  if (f < at || t >= 1) return null;
  return <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(circle at 50% 46%, rgba(255,196,84,${0.55 * (1 - t)}), transparent ${18 + 70 * t}%)` }} />;
};

export const Turn: React.FC<{ children: React.ReactNode; mb?: number }> = ({ children, mb = 22 }) => <div style={{ marginBottom: mb }}>{children}</div>;
