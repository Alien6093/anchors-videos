import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Format } from '../lib/format';
import { easeInOut, easeOut, fmtIN, lerp, pop, prog } from '../lib/anim';
import { C, FONT_SANS } from '../components/theme';
import { Backdrop } from './Backdrop';
import { ACCENT, T } from './tokens';

type Row = { readonly name: string; readonly value: number; readonly from: number; readonly to: number; readonly hero?: boolean };

/** Final values from the script; Darika FLIPs from last to first (4th to 1st). */
const ROWS: readonly Row[] = [
  { name: 'Darika Jain', value: 68900, from: 2, to: 0, hero: true },
  { name: 'Shubhangi Shrivastava', value: 61500, from: 0, to: 1 },
  { name: 'Ashish Shukla', value: 44800, from: 1, to: 2 },
];
const TOTAL = 280000;
const COUNT_FRAMES = 20;
const FLIP_AT = 32;
const FLIP_FRAMES = 16;
const TOTAL_LOCK = 112;
const MAX_VALUE = 68900;

type Dim = { top: number; w: number; row: number; pad: number; name: number; num: number };
const DIM: Record<Format, Dim> = {
  '916': { top: 600, w: 960, row: 118, pad: 36, name: 42, num: 54 },
  '45': { top: 280, w: 920, row: 104, pad: 32, name: 36, num: 48 },
};

const RowView: React.FC<{ row: Row; d: Dim; local: number }> = ({ row, d, local }) => {
  const slot = lerp(row.from, row.to, prog(local, FLIP_AT, FLIP_FRAMES, easeInOut));
  const count = prog(local, 2, COUNT_FRAMES, easeOut);
  const flipGlow = row.hero ? Math.sin(Math.min(1, prog(local, FLIP_AT, FLIP_FRAMES + 10, (x) => x)) * Math.PI) : 0;
  const enter = pop(local, 0 + row.from, 14, 170, 0.7);
  const barW = (row.value / MAX_VALUE) * count;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: slot * d.row, height: d.row - 10, opacity: Math.min(1, enter * 2), zIndex: row.hero ? 2 : 1 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: row.hero && local >= FLIP_AT ? '#3a2316' : '#1d1b19', border: `2px solid ${row.hero ? `rgba(242,128,58,${0.25 + 0.6 * flipGlow})` : 'rgba(255,255,255,.08)'}`, boxShadow: flipGlow > 0 ? `0 0 ${40 * flipGlow}px rgba(242,128,58,.5)` : undefined }} />
      <div style={{ position: 'absolute', left: d.pad, right: d.pad, top: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: d.name, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{row.name}</span>
        <span style={{ fontSize: d.num, fontWeight: 900, color: row.hero ? ACCENT : '#fff', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{fmtIN(row.value * count)}</span>
      </div>
      <div style={{ position: 'absolute', left: d.pad, right: d.pad, bottom: 16, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.1)' }}>
        <div style={{ width: `${barW * 100}%`, height: '100%', borderRadius: 5, background: row.hero ? ACCENT : 'rgba(255,255,255,.75)' }} />
      </div>
    </div>
  );
};

const Chip: React.FC<{ label: string; value: string; size: number; delay: number; local: number }> = ({ label, value, size, delay, local }) => {
  const p = pop(local, delay, 12, 190, 0.6);
  return (
    <div style={{ flex: 1, textAlign: 'center', opacity: Math.min(1, p * 3), transform: `scale(${lerp(0.8, 1, Math.min(p, 1.1))})`, background: 'rgba(255,255,255,.06)', borderRadius: 20, padding: '12px 0' }}>
      <div style={{ fontSize: size, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: size * 0.5, fontWeight: 600, color: C.muted }}>{label}</div>
    </div>
  );
};

/** Native compact table replacing the source table for S6 (no off-script mid-count values). */
export const Table3: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const local = frame - T.s6;
  if (local < 0 || frame >= T.s7) return null;
  const d = DIM[format];
  const total = TOTAL * prog(local, 4, 26, easeOut);
  const locked = local >= TOTAL_LOCK;
  const lockPulse = locked ? Math.max(0, 1 - (local - TOTAL_LOCK) / 10) : 0;
  const chipSize = format === '916' ? 46 : 40;
  const listH = d.row * 3;
  return (
    <AbsoluteFill>
      <Backdrop cyPct={format === '916' ? 45 : 50} strength={0.14} />
      <div style={{ position: 'absolute', left: (1080 - d.w) / 2, width: d.w, top: d.top, fontFamily: FONT_SANS }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: C.muted, fontSize: d.name * 0.7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px 14px' }}>
          <span>Creator</span><span>Impressions</span>
        </div>
        <div style={{ position: 'relative', height: listH }}>
          {ROWS.map((r) => <RowView key={r.name} row={r} d={d} local={local} />)}
        </div>
        <div style={{
          marginTop: 6, borderRadius: 22, padding: `18px ${d.pad}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          background: locked ? `rgba(63,178,127,${0.22 + 0.3 * lockPulse})` : 'rgba(255,255,255,.08)', border: `2px solid ${locked ? C.green : 'rgba(255,255,255,.12)'}`,
          transform: `scale(${1 + 0.04 * lockPulse})`,
        }}>
          <span style={{ fontSize: d.name, fontWeight: 800, color: '#fff' }}>Total, 8 creators</span>
          <span style={{ fontSize: d.num * 1.1, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{fmtIN(total)}</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 18 }}>
          <Chip label="Likes" value="4,500" size={chipSize} delay={TOTAL_LOCK - 6} local={local} />
          <Chip label="Comments" value="361" size={chipSize} delay={TOTAL_LOCK - 3} local={local} />
          <Chip label="Engagement" value="1.74%" size={chipSize} delay={TOTAL_LOCK} local={local} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
