import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_SERIF } from './theme';
import { CREATORS, SENTIMENT } from '../lib/data';
import { Counter } from './Counter';
import { fmtIN, lerp, pop, prog } from './anim';

const Box: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.015)', fontFamily: FONT_SERIF, color: C.text, ...style }}>{children}</div>
);

export const MetricsTable: React.FC<{ start?: number; dur?: number }> = ({ start = 0, dur = 36 }) => {
  const f = useCurrentFrame();
  const rows: [string, React.ReactNode][] = [
    ['Reach', <Counter key="r" value={280000} start={start} duration={dur} />],
    ['Likes', <Counter key="l" value={4500} start={start} duration={dur} />],
    ['Comments', <Counter key="c" value={361} start={start} duration={dur} />],
    ['Avg engagement', <Counter key="e" value={1.74} start={start} duration={dur} decimals={2} suffix="%" />],
    ['Budget used', <span key="b">₹<Counter value={147000} start={start} duration={dur} /> of ₹1,50,000</span>],
  ];
  return (
    <Box>
      {rows.map(([k, v], i) => {
        const p = pop(f, start - 10 + i * 3, 16, 170);
        return (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 66, padding: '0 28px', alignContent: 'center', boxSizing: 'border-box', borderBottom: i < rows.length - 1 ? `1.5px solid ${C.border}` : undefined, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(-24, 0, p)}px)` }}>
            <span style={{ fontSize: 30, color: C.muted, lineHeight: '66px' }}>{k}</span>
            <span style={{ fontSize: 38, fontWeight: 600, color: C.text, lineHeight: '66px' }}>{v}</span>
          </div>
        );
      })}
    </Box>
  );
};

export const CreatorMetricsTable: React.FC<{ start?: number; stagger?: number }> = ({ start = 0, stagger = 5 }) => {
  const f = useCurrentFrame();
  const head = ['Creator', 'Impressions', 'Likes', 'Comments'];
  const cols = [0.36, 0.26, 0.19, 0.19];
  return (
    <Box>
      <div style={{ display: 'flex', height: 62, alignItems: 'center', padding: '0 28px', background: '#2a2927', borderBottom: `1.5px solid ${C.border}` }}>
        {head.map((h, i) => <div key={h} style={{ width: `${cols[i] * 100}%`, fontSize: 27, fontWeight: 600, textAlign: i ? 'right' : 'left' }}>{h}</div>)}
      </div>
      {CREATORS.map((c, i) => {
        const p = pop(f, start + i * stagger, 16, 170);
        const cells = [c.name, fmtIN(c.impressions), fmtIN(c.likes), fmtIN(c.comments)];
        return (
          <div key={c.key} style={{ display: 'flex', height: 58, alignItems: 'center', padding: '0 28px', borderBottom: i < 7 ? `1.5px solid ${C.border}` : undefined, opacity: Math.min(1, p * 2), transform: `translateX(${lerp(50, 0, p)}px)` }}>
            {cells.map((v, j) => <div key={j} style={{ width: `${cols[j] * 100}%`, fontSize: 28, textAlign: j ? 'right' : 'left', fontVariantNumeric: 'tabular-nums' }}>{v}</div>)}
          </div>
        );
      })}
    </Box>
  );
};

export const SentimentBar: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame();
  const t = prog(f, start, 34);
  const parts = [
    { l: 'positive', v: SENTIMENT.positive, c: C.green },
    { l: 'neutral', v: SENTIMENT.neutral, c: '#8d8b85' },
    { l: 'negative', v: SENTIMENT.negative, c: '#E5604D' },
  ];
  return (
    <div style={{ fontFamily: FONT_SANS, opacity: prog(f, start - 6, 8) }}>
      <div style={{ fontSize: 28, color: C.muted, marginBottom: 12 }}>Comment sentiment</div>
      <div style={{ display: 'flex', height: 30, borderRadius: 15, overflow: 'hidden', gap: 4, width: `${t * 100}%`, minWidth: 0 }}>
        {parts.map((p) => <div key={p.l} style={{ flex: p.v, background: p.c }} />)}
      </div>
      <div style={{ display: 'flex', gap: 34, marginTop: 14, fontSize: 30, color: C.text }}>
        {parts.map((p) => <span key={p.l}><b style={{ color: p.c }}>{Math.round(p.v * t)}%</b> {p.l}</span>)}
      </div>
    </div>
  );
};

const CHIPS = [
  ['Top role', 'HR Manager / Talent Acquisition 41%'],
  ['Top location', 'Delhi NCR 24%'],
  ['Top industry', 'IT Services 27%'],
  ['Top seniority', 'Senior 34%'],
];

export const AudienceChips: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontFamily: FONT_SANS }}>
      {CHIPS.map(([k, v], i) => {
        const p = pop(f, start + i * 5, 10, 200, 0.6);
        return (
          <div key={k} style={{ background: C.bubble, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '12px 26px', fontSize: 28, color: C.text, transform: `scale(${lerp(0.4, 1, p)})`, opacity: Math.min(1, p * 2) }}>
            <span style={{ color: C.muted }}>{k}</span> &nbsp;{v}
          </div>
        );
      })}
    </div>
  );
};
