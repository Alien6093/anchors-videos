import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { prog, pop, lerp } from '../lib/anim';
import { CREATORS } from './tokens';
import { useL, useS } from './layout';

export const Avatar: React.FC<{ k: string; size: number; ring?: string }> = ({ k, size, ring }) => (
  <Img
    src={staticFile(CREATORS[k].photo)}
    style={{ width: size, height: size, borderRadius: size / 2, objectFit: 'cover', flexShrink: 0, border: ring ? `3px solid ${ring}` : undefined, display: 'block' }}
  />
);

export type St = 'Awaiting draft' | 'Draft ready' | 'Changes requested' | 'Approved' | 'Scheduled' | 'Live' | 'Revised';
const ST: Record<St, { fg: string; bg: string }> = {
  'Awaiting draft': { fg: '#b4b1aa', bg: 'rgba(255,255,255,.09)' },
  'Draft ready': { fg: '#9cc5ff', bg: 'rgba(106,168,255,.18)' },
  'Changes requested': { fg: '#f8bf74', bg: 'rgba(240,162,74,.2)' },
  Revised: { fg: '#f8bf74', bg: 'rgba(240,162,74,.2)' },
  Approved: { fg: '#6fe0a8', bg: 'rgba(63,178,127,.22)' },
  Scheduled: { fg: '#d3c3ff', bg: 'rgba(182,156,255,.2)' },
  Live: { fg: '#6fe0a8', bg: 'rgba(63,178,127,.24)' },
};

/** Status pill. `since` = frames since the status last changed (small pop for 8 f). */
export const Pill: React.FC<{ status: St; since?: number; font?: number }> = ({ status, since = 99, font = 46 }) => {
  const s = useS();
  const t = prog(since, 0, 8);
  const flash = since >= 0 && since < 8 ? 1 - t : 0;
  const c = ST[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s(12), fontFamily: FONT_SANS, fontWeight: 700, fontSize: s(font),
      color: c.fg, background: c.bg, borderRadius: 999, padding: `${s(6)}px ${s(22)}px`, whiteSpace: 'nowrap', lineHeight: 1.15,
      transform: `scale(${1 + 0.1 * flash})`, boxShadow: flash > 0 ? `0 0 ${s(30) * flash}px ${c.fg}66` : undefined,
    }}>
      {(status === 'Live') && <span style={{ width: s(16), height: s(16), borderRadius: s(8), background: C.green, boxShadow: `0 0 ${s(14)}px ${C.green}` }} />}
      {status === 'Approved' && <svg width={s(34)} height={s(34)} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={c.fg} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {status}
    </span>
  );
};

export const Tick: React.FC<{ size: number; bad?: boolean; since?: number }> = ({ size, bad, since = 99 }) => {
  const sc = since < 0 ? 0 : pop(since, 0, 9, 190);
  const col = bad ? '#ef5b4d' : C.green;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `scale(${sc})`, flexShrink: 0 }}>
      <circle cx="20" cy="20" r="19" fill={col} />
      {bad
        ? <path d="M13 13l14 14M27 13L13 27" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
        : <path d="M11 20.5l6 6 12-13" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

export const Cursor: React.FC<{ x: number; y: number; size: number; press?: number }> = ({ x, y, size, press = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.14 * press})`, transformOrigin: '20% 10%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.55))', zIndex: 20 }}>
    <path d="M4 2l15 9.2-6.6 1.5 3.7 7.1-2.9 1.5-3.7-7.2L4.6 19z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({ children, style, pad = 24 }) => {
  const s = useS();
  return (
    <div style={{ background: C.panel, border: `2px solid ${C.border}`, borderRadius: s(30), padding: s(pad), boxShadow: '0 24px 60px rgba(0,0,0,.45)', ...style }}>{children}</div>
  );
};

/** Container for one scene's card content inside the card band. Pops in without ever being empty. */
export const Stage: React.FC<{ f: number; children: React.ReactNode; align?: 'top' | 'center'; noEnter?: boolean; push?: number; dim?: number }> = ({
  f, children, align = 'top', noEnter, push = 0, dim = 0,
}) => {
  const L = useL();
  const enter = noEnter ? 1 : prog(f, 0, 6);
  const sc = lerp(noEnter ? 1 : 0.965, 1, enter) * (1 + push);
  return (
    <div style={{
      position: 'absolute', left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, transform: `scale(${sc})`, transformOrigin: '50% 40%',
      filter: dim > 0 ? `brightness(${1 - dim})` : undefined,
    }}>
      <div style={{
        width: L.inW, height: L.inH, display: 'flex', flexDirection: 'column', justifyContent: align === 'top' ? 'flex-start' : 'center',
        transform: `scale(${L.zoom})`, transformOrigin: '0 0', fontFamily: FONT_SANS,
      }}>{children}</div>
    </div>
  );
};

/** Highlighted / underlined phrases inside running text. */
export type Mark = { phrase: string; at: number; color?: string; kind?: 'underline' | 'fill' };

export const MarkedText: React.FC<{ text: string; marks: Mark[]; f: number; size: number; color?: string; lineHeight?: number }> = ({
  text, marks, f, size, color = C.ink, lineHeight = 1.32,
}) => {
  const parts: { t: string; m?: Mark }[] = [];
  let rest = text;
  while (rest.length) {
    let best: { i: number; m: Mark } | null = null;
    for (const m of marks) {
      const i = rest.indexOf(m.phrase);
      if (i >= 0 && (!best || i < best.i)) best = { i, m };
    }
    if (!best) { parts.push({ t: rest }); break; }
    if (best.i > 0) parts.push({ t: rest.slice(0, best.i) });
    parts.push({ t: best.m.phrase, m: best.m });
    rest = rest.slice(best.i + best.m.phrase.length);
  }
  return (
    <div style={{ fontSize: size, lineHeight, color, fontWeight: 500, fontFamily: FONT_SANS, letterSpacing: '-0.01em' }}>
      {parts.map((p, i) => {
        if (!p.m) return <span key={i}>{p.t}</span>;
        const t = prog(f, p.m.at, 8);
        const col = p.m.color ?? C.amber;
        const fill = p.m.kind === 'fill';
        return (
          <span key={i} style={{
            backgroundImage: fill
              ? `linear-gradient(${col}88, ${col}88)`
              : `linear-gradient(${col}, ${col}), linear-gradient(${col}33, ${col}33)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: fill ? `${t * 100}% 100%` : `${t * 100}% 4px, ${t * 100}% 100%`,
            backgroundPosition: fill ? 'left center' : 'left bottom, left center',
            WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone',
            borderRadius: 4,
          }}>{p.t}</span>
        );
      })}
    </div>
  );
};
