import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_SERIF } from '../theme';
import { lerp, prog } from '../anim';

const PARTS = [
  { l: 'positive', pct: 71, n: 256, c: C.green },
  { l: 'neutral', pct: 25, n: 91, c: '#8d8b85' },
  { l: 'negative', pct: 4, n: 14, c: '#E5604D' },
];

/** Largest-remainder split of round(sum(values) * t) so the parts always add up to the shared total at progress t. */
const shareAt = (values: number[], t: number): number[] => {
  const total = Math.round(values.reduce((a, b) => a + b, 0) * t);
  const raw = values.map((v) => v * t);
  const base = raw.map(Math.floor);
  const order = raw.map((v, i) => ({ i, r: v - base[i] })).sort((a, b) => b.r - a.r);
  const extra = total - base.reduce((a, b) => a + b, 0);
  return base.map((b, i) => b + (order.findIndex((o) => o.i === i) < extra ? 1 : 0));
};

export const SentimentBlock: React.FC<{ at: number; dur?: number }> = ({ at, dur = 26 }) => {
  const f = useCurrentFrame();
  const t = prog(f, at, dur);
  const pcts = shareAt(PARTS.map((p) => p.pct), t);
  const counts = shareAt(PARTS.map((p) => p.n), t);
  return (
    <div style={{ fontFamily: FONT_SANS, opacity: prog(f, at - 6, 8) }}>
      <div style={{ display: 'flex', height: 34, borderRadius: 17, overflow: 'hidden', gap: 4, width: `${t * 100}%` }}>
        {PARTS.map((p) => <div key={p.l} style={{ flex: p.pct, background: p.c }} />)}
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 16, fontSize: 32, color: C.text }}>
        {PARTS.map((p, i) => (
          <span key={p.l}><b style={{ color: p.c }}>{pcts[i]}%</b> {p.l} <span style={{ color: C.muted, fontSize: 28 }}>({counts[i]})</span></span>
        ))}
      </div>
    </div>
  );
};

type CardProps = { name: string; text: string; kind: 'positive' | 'negative'; at: number; out?: number };

export const CommentCard: React.FC<CardProps> = ({ name, text, kind, at, out }) => {
  const f = useCurrentFrame();
  const i = prog(f, at, 14);
  const o = out === undefined ? 0 : prog(f, out, 12);
  const cut = text.search(/[.?!] /);
  const readPart = cut < 0 ? text : text.slice(0, cut + 1);
  const restPart = cut < 0 ? '' : text.slice(cut + 2);
  const col = kind === 'positive' ? C.green : '#E5604D';
  if (i <= 0 || o >= 1) return null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 0, boxSizing: 'border-box', background: C.panel, border: `1.5px solid ${C.border}`, borderLeft: `7px solid ${col}`, borderRadius: 22, padding: '28px 36px 30px',
      fontFamily: FONT_SANS, opacity: i * (1 - o), transform: `translateX(${lerp(180, 0, i) + lerp(0, -180, o)}px)`, boxShadow: '0 24px 60px rgba(0,0,0,.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: C.bubble, color: C.text, fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{name[0]}</div>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.text }}>{name}</div>
        <div style={{ marginLeft: 'auto', fontSize: 26, fontWeight: 700, color: col, background: `${col}26`, padding: '6px 18px', borderRadius: 999 }}>{kind === 'positive' ? 'Positive' : 'Negative'}</div>
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 38, lineHeight: 1.42, color: '#fff' }}>
        &ldquo;{readPart}{restPart && <span style={{ opacity: 0.35 }}> {restPart}</span>}&rdquo;
      </div>
    </div>
  );
};
