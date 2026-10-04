import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SERIF, FONT_SANS } from '../theme';
import { fmtIN, lerp, pop } from '../anim';

export type RankMetrics = { imp: number; likes: number; comments: number; eng: number };
export type RankRowData = { key: string; name: string; post: string; snap: RankMetrics; fin: RankMetrics; snapRank: number; finRank: number };

export const RANK_ROW_H = 56;
export const RANK_HEAD_H = 62;
export const RANK_TOTAL_H = 66;
export const RANK_W = 1600;
const COLS = [0.21, 0.26, 0.13, 0.10, 0.12, 0.18];
const ROW_BG = '#1f1e1d';
const HEAD = ['Creator', 'Posted', 'Impressions', 'Likes', 'Comments', 'Engagement rate'];
const TODAY_KEYS = ['priyanshu', 'darika'];

type Totals = { snap: RankMetrics; fin: RankMetrics; mix: number; opacity: number; flash: number };

type Props = {
  rows: RankRowData[];
  enterAt: number;
  stagger?: number;
  /** 0 = snapshot order, 1 = final order */
  flip: number;
  /** 0 = snapshot values, 1 = final values */
  mix: number;
  rowDim: Record<string, number>;
  cream?: Record<string, number>;
  pulse?: Record<string, number>;
  /** 0..1 fill for Darika impressions (orange) and Jyoti engagement (green) */
  accent?: number;
  today?: number;
  totals?: Totals | null;
  showTotals?: boolean;
};

const fmt = (m: RankMetrics, mix: number, o: RankMetrics) => ({
  imp: fmtIN(lerp(m.imp, o.imp, mix)),
  likes: fmtIN(lerp(m.likes, o.likes, mix)),
  comments: fmtIN(lerp(m.comments, o.comments, mix)),
  eng: `${lerp(m.eng, o.eng, mix).toFixed(2)}%`,
});

/** hi = [r,g,b] chip colour; accent 0..1 drives the chip opacity (layout never changes: padding is offset by a negative margin). */
const Cell: React.FC<{ i: number; children: React.ReactNode; hi?: string; accent?: number }> = ({ i, children, hi, accent = 0 }) => (
  <div style={{ width: `${COLS[i] * 100}%`, textAlign: i > 1 ? 'right' : 'left', paddingRight: i > 1 ? 8 : 0, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
    <span style={{ background: hi ? `rgba(${hi},${0.85 * accent})` : undefined, borderRadius: 8, padding: hi ? '2px 10px' : 0, margin: hi ? '0 -10px' : 0, color: hi && accent > 0 ? '#fff' : undefined, fontWeight: hi && accent > 0.02 ? 600 : 400 }}>{children}</span>
  </div>
);

const PostChip: React.FC<{ label: string; today: number }> = ({ label, today }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: FONT_SANS, fontSize: 22 }}>
    <span style={{ padding: '3px 14px', borderRadius: 999, background: `rgba(${lerp(255, 251, today)},${lerp(255, 247, today)},${lerp(255, 241, today)},${lerp(0.08, 1, today)})`, color: today > 0.5 ? C.ink : C.muted, fontWeight: 600 }}>{label}</span>
    {today > 0.01 && <span style={{ padding: '4px 18px', borderRadius: 999, border: `1.5px solid ${C.cream}`, color: C.cream, fontSize: 28, opacity: Math.min(1, today) }}>posted today</span>}
  </div>
);

export const RankTable: React.FC<Props> = ({ rows, enterAt, stagger = 3, flip, mix, rowDim, cream = {}, pulse = {}, accent = 0, today = 0, totals = null, showTotals = false }) => {
  const f = useCurrentFrame();
  const headP = pop(f, enterAt - 6, 16, 170);
  const bodyH = rows.length * RANK_ROW_H;
  return (
    <div style={{ width: RANK_W, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.015)', fontFamily: FONT_SERIF, color: C.text, fontSize: 28 }}>
      <div style={{ display: 'flex', height: RANK_HEAD_H, alignItems: 'center', padding: '0 24px', background: '#2a2927', borderBottom: `1.5px solid ${C.border}`, fontWeight: 600, fontSize: 26, opacity: Math.min(1, headP * 2) }}>
        {HEAD.map((h, i) => <Cell key={h} i={i}>{h}</Cell>)}
      </div>
      <div style={{ position: 'relative', height: bodyH + (showTotals ? RANK_TOTAL_H : 0) }}>
        {rows.map((r) => {
          const p = pop(f, enterAt + r.snapRank * stagger, 16, 170);
          const rank = lerp(r.snapRank, r.finRank, flip);
          const v = fmt(r.snap, mix, r.fin);
          const isToday = TODAY_KEYS.includes(r.key);
          const travel = r.snapRank - r.finRank;
          const lift = Math.sin(Math.min(1, Math.max(0, flip)) * Math.PI) * (travel > 0 ? 1 : 0);
          const pl = pulse[r.key] ?? 0;
          const cr = cream[r.key] ?? 0;
          const tints = [`rgba(251,247,241,${0.13 * cr + 0.1 * pl})`, `rgba(232,116,59,${0.12 * lift})`];
          return (
            <div key={r.key} style={{
              position: 'absolute', left: 0, right: 0, top: rank * RANK_ROW_H, height: RANK_ROW_H, boxSizing: 'border-box',
              opacity: Math.min(1, p * 2),
              transform: `translateX(${lerp(60, 0, Math.min(1, p))}px)`, zIndex: 10 + travel,
              backgroundColor: ROW_BG, backgroundImage: tints.map((t) => `linear-gradient(${t},${t})`).join(','),
              boxShadow: lift > 0.05 ? `0 10px ${40 * lift}px rgba(0,0,0,.5)` : undefined,
            }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.5, background: C.border, opacity: rowDim[r.key] ?? 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px', opacity: rowDim[r.key] ?? 1 }}>
                <Cell i={0}>{r.name}</Cell>
                <div style={{ width: `${COLS[1] * 100}%` }}><PostChip label={r.post} today={isToday ? today : 0} /></div>
                <Cell i={2} hi={r.key === 'darika' ? '232,116,59' : undefined} accent={accent}>{v.imp}</Cell>
                <Cell i={3}>{v.likes}</Cell>
                <Cell i={4}>{v.comments}</Cell>
                <Cell i={5} hi={r.key === 'jyoti' ? '63,178,127' : undefined} accent={accent}>{v.eng}</Cell>
              </div>
            </div>
          );
        })}
        {showTotals && totals && (
          <div style={{
            position: 'absolute', left: 0, right: 0, top: bodyH, height: RANK_TOTAL_H, display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box', fontWeight: 800, fontSize: 30,
            background: `rgba(251,247,241,${0.05 + 0.22 * totals.flash})`, opacity: totals.opacity,
          }}>
            {(() => {
              const t = fmt(totals.snap, totals.mix, totals.fin);
              return (<><Cell i={0}>Total</Cell><div style={{ width: `${COLS[1] * 100}%` }} /><Cell i={2}>{t.imp}</Cell><Cell i={3}>{t.likes}</Cell><Cell i={4}>{t.comments}</Cell><Cell i={5}>{t.eng}</Cell></>);
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
