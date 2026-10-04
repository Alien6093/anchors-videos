import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { Counter } from '../Counter';
import { lerp, prog } from '../anim';

const ROW_STAGGER = 3;
const PULSE_FRAMES = 14;
const PULSE_SCALE = 0.12;

const ROWS = [
  { label: 'Impressions', value: 44800 },
  { label: 'Likes', value: 728 },
  { label: 'Comments', value: 63 },
] as const;

type Props = {
  /** scene frame the table starts entering */
  at: number;
  countAt: number;
  countDur: number;
  /** 0..1 dim amount applied to header + value rows (sync row is always dim) */
  dim: number;
};

const CELL: React.CSSProperties = { padding: '11px 4px', borderBottom: `1px solid ${C.border}`, fontSize: 28 };
const DIM_OPACITY = 0.35;

/** claude.ai chat-style markdown table: thin rules, dark, no card. */
export const CreatorPostTable: React.FC<Props> = ({ at, countAt, countDur, dim }) => {
  const f = useCurrentFrame();
  const rowStyle = (i: number): React.CSSProperties => {
    const p = prog(f, at + i * ROW_STAGGER, 10);
    return { opacity: p, transform: `translateY(${lerp(16, 0, p)}px)` };
  };
  const base = lerp(1, DIM_OPACITY, dim);
  const pulseT = prog(f, at + 6, PULSE_FRAMES, (t) => t);
  const pulse = 1 + PULSE_SCALE * Math.sin(Math.PI * pulseT);
  return (
    <div style={{ fontFamily: FONT_SANS, color: C.text }}>
      <div style={{ ...rowStyle(0), opacity: rowStyle(0).opacity as number * base, display: 'flex', alignItems: 'center', gap: 20, padding: '0 4px 12px', borderBottom: `2px solid ${C.muted}` }}>
        <span style={{ fontSize: 30, fontWeight: 700 }}>
          <span style={{ textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 2 }}>Ashish Shukla</span> — post performance
        </span>
        <span style={{
          fontSize: 22, fontWeight: 600, color: '#5ed39d', background: 'rgba(63,178,127,.18)', borderRadius: 999, padding: '4px 16px',
          transform: `scale(${pulse})`,
        }}>Published</span>
      </div>
      {[
        { key: 'h', cells: ['Metric', 'Value'], head: true, o: base, i: 1 },
        ...ROWS.map((r, i) => ({ key: r.label, cells: [r.label, r.value], head: false, o: base, i: i + 2 })),
        { key: 'sync', cells: ['Last synced', 'Fri 23 Oct 2026'], head: false, o: DIM_OPACITY, i: 5 },
      ].map((row) => {
        const rs = rowStyle(row.i);
        return (
          <div key={row.key} style={{ ...rs, opacity: (rs.opacity as number) * row.o, display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ ...CELL, borderBottom: 'none', width: '60%', color: row.head ? C.muted : '#cfcdc7', fontWeight: row.head ? 600 : 400 }}>{row.cells[0]}</div>
            <div style={{ ...CELL, borderBottom: 'none', flex: 1, color: row.head ? C.muted : C.text, fontWeight: row.head ? 600 : row.key === 'sync' ? 400 : 700, fontVariantNumeric: 'tabular-nums' }}>
              {typeof row.cells[1] === 'number' ? <Counter value={row.cells[1]} start={countAt} duration={countDur} /> : row.cells[1]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
