import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_SERIF } from '../theme';
import { fmtIN, lerp, pop, prog } from '../anim';

export type MetricRow = { name: string; imp: number; likes: number; comments: number; eng: string };
export const RANKED: MetricRow[] = [
  { name: 'Darika Jain', imp: 68900, likes: 1085, comments: 72, eng: '1.68%' },
  { name: 'Shubhangi Shrivastava', imp: 61500, likes: 905, comments: 64, eng: '1.58%' },
  { name: 'Ashish Shukla', imp: 44800, likes: 728, comments: 63, eng: '1.77%' },
  { name: 'Gunjan Mishra', imp: 34200, likes: 512, comments: 38, eng: '1.61%' },
  { name: 'Sunidhi', imp: 26400, likes: 401, comments: 27, eng: '1.62%' },
  { name: 'Riya Dadhich', imp: 17800, likes: 262, comments: 21, eng: '1.59%' },
  { name: 'Priyanshu Manas', imp: 14300, likes: 318, comments: 41, eng: '2.51%' },
  { name: 'Jyoti Vyas', imp: 12100, likes: 289, comments: 35, eng: '2.68%' },
];

type TileProps = { label: string; at: number; flex?: number; glow?: number; children: React.ReactNode; sub?: React.ReactNode; bar?: number; glowRGB?: string };

export const Tile: React.FC<TileProps> = ({ label, at, flex = 1, glow = 0, children, sub, bar, glowRGB = '251,247,241' }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14, 170);
  return (
    <div style={{
      flex, minWidth: 0, boxSizing: 'border-box', background: C.panel, border: `2px solid ${glow > 0.02 ? `rgba(${glowRGB},${0.35 + 0.6 * glow})` : C.border}`, borderRadius: 22, padding: '20px 26px 20px', fontFamily: FONT_SANS,
      opacity: Math.min(1, p * 2), transform: `translateY(${lerp(50, 0, p)}px) scale(${lerp(0.92, 1, p)})`, boxShadow: glow > 0 ? `0 0 ${50 * glow}px rgba(${glowRGB},${0.3 * glow})` : undefined,
    }}>
      <div style={{ fontSize: 26, color: C.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 62, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{children}</div>
      {sub && <div style={{ fontSize: 26, color: C.muted, marginTop: 2, whiteSpace: 'nowrap' }}>{sub}</div>}
      {bar !== undefined && (
        <div style={{ marginTop: 10, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
          <div style={{ width: `${bar * 98}%`, height: '100%', background: C.green, borderRadius: 6 }} />
        </div>
      )}
    </div>
  );
};

const COLS = [0.3, 0.2, 0.14, 0.16, 0.2];
const HEAD = ['Creator', 'Impressions', 'Likes', 'Comments', 'Engagement rate'];

export const CreatorTable: React.FC<{ start: number; stagger?: number; dimAt: number; lockAt: number; width?: number }> = ({ start, stagger = 6, dimAt, lockAt, width = 1300 }) => {
  const f = useCurrentFrame();
  const dim = prog(f, dimAt, 12);
  const lock = pop(f, lockAt, 12, 200);
  const flash = f >= lockAt && f < lockAt + 20 ? 1 - (f - lockAt) / 20 : 0;
  const cell = (v: string, j: number, hi?: string): React.ReactNode => (
    <div key={j} style={{ width: `${COLS[j] * 100}%`, textAlign: j ? 'right' : 'left', paddingRight: j ? 8 : 0, fontVariantNumeric: 'tabular-nums' }}>
      <span style={{ background: hi ? `${hi}` : undefined, borderRadius: 8, padding: hi ? '2px 10px' : 0, color: hi ? '#fff' : undefined, fontWeight: hi ? 700 : 400 }}>{v}</span>
    </div>
  );
  return (
    <div style={{ width, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.015)', fontFamily: FONT_SERIF, color: C.text, fontSize: 28 }}>
      <div style={{ display: 'flex', height: 62, alignItems: 'center', padding: '0 24px', background: '#2a2927', borderBottom: `1.5px solid ${C.border}`, fontWeight: 600, fontSize: 26, opacity: prog(f, start - 8, 8) }}>
        {HEAD.map((h, j) => <div key={h} style={{ width: `${COLS[j] * 100}%`, textAlign: j ? 'right' : 'left', paddingRight: j ? 8 : 0, whiteSpace: 'nowrap' }}>{h}</div>)}
      </div>
      {RANKED.map((r, i) => {
        const p = pop(f, start + i * stagger, 16, 170);
        const isD = i === 0;
        const isJ = i === 7;
        const rowDim = isD || isJ ? 1 : lerp(1, 0.4, dim);
        return (
          <div key={r.name} style={{ display: 'flex', height: 56, alignItems: 'center', padding: '0 24px', borderBottom: `1.5px solid ${C.border}`, opacity: Math.min(1, p * 2) * rowDim, transform: `translateX(${lerp(60, 0, p)}px)` }}>
            {cell(r.name, 0)}{cell(fmtIN(r.imp), 1, isD && dim > 0.5 ? 'rgba(232,116,59,.85)' : undefined)}{cell(fmtIN(r.likes), 2)}{cell(fmtIN(r.comments), 3)}{cell(r.eng, 4, isJ && dim > 0.5 ? 'rgba(63,178,127,.85)' : undefined)}
          </div>
        );
      })}
      <div style={{ display: 'flex', height: 66, alignItems: 'center', padding: '0 24px', fontWeight: 800, fontSize: 30, background: `rgba(251,247,241,${0.06 + 0.2 * flash})`, opacity: Math.min(1, lock * 2), transform: `scale(${lerp(0.97, 1, Math.min(1, lock))})` }}>
        {['Total', '2,80,000', '4,500', '361', '1.74%'].map((v, j) => <div key={j} style={{ width: `${COLS[j] * 100}%`, textAlign: j ? 'right' : 'left', paddingRight: j ? 8 : 0, fontVariantNumeric: 'tabular-nums' }}>{v}</div>)}
      </div>
    </div>
  );
};
