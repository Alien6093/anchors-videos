import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, ClaudeReply, FONT_SANS } from '../index';
import { Board } from '../b/Board';
import { Turn } from '../b/bits';
import { LIVE_DATES, ORDER_LIVE, row, st } from '../b/kit';
import { lerp, prog } from '../anim';

const FLIP0 = 33;
const FLIP_GAP = 4;
const DIM_AT = 68;
const DIM = 0.35;
const DAYS: [string, string][] = [['Wed 7', '3 posts'], ['Thu 8', '3 posts'], ['Fri 9', '2 posts']];
export const CONTEXT_FLIPS_END = FLIP0 + 7 * FLIP_GAP + 10;

/** Scene 2 chat content: "All 8 posts are live." + board. Time base = scene 2 local frame. */
export const ContextBlock: React.FC = () => {
  const f = useCurrentFrame();
  const dim = lerp(1, DIM, prog(f, DIM_AT, 14));
  const rows = ORDER_LIVE.map((k, i) => row(k, {
    enterAt: 2 + i * 2,
    status: st<'Scheduled' | 'Live'>([0, 'Scheduled'], [FLIP0 + i * FLIP_GAP, 'Live']),
    publish: st([0, LIVE_DATES[k]]),
    dim,
  }));
  const live = ORDER_LIVE.filter((_, i) => f >= FLIP0 + i * FLIP_GAP).length;
  const pillPop = 1 + 0.08 * Math.sin(prog(f, CONTEXT_FLIPS_END - 10, 14, (t) => t) * Math.PI);
  return (
    <div>
      <Turn mb={16}><div style={{ opacity: lerp(1, 0.55, prog(f, DIM_AT, 14)) }}><ClaudeReply text="All 8 posts are live." start={6} wordGap={3} size={34} /></div></Turn>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, fontFamily: FONT_SANS, opacity: prog(f, 12, 8) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 36, fontWeight: 700, color: '#5ed39d', background: 'rgba(63,178,127,.18)', padding: '10px 26px', borderRadius: 16, transform: `scale(${pillPop})` }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: C.green, boxShadow: `0 0 14px ${C.green}` }} />{live} Live
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#c8b4ff', background: 'rgba(182,156,255,.17)', padding: '10px 26px', borderRadius: 16, opacity: DIM + (1 - DIM) * (1 - prog(f, DIM_AT, 14)) }}>{8 - live} Scheduled</div>
        <div style={{ flex: 1 }} />
        {DAYS.map(([d, n], i) => (
          <div key={d} style={{ background: C.cream, color: C.ink, borderRadius: 14, padding: '6px 16px', textAlign: 'center', opacity: lerp(1, DIM, prog(f, DIM_AT, 14)), transform: `scale(${lerp(0.5, 1, prog(f, 20 + i * 4, 10))})` }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{d}</div><div style={{ fontSize: 22, color: C.inkSoft }}>{n}</div>
          </div>
        ))}
      </div>
      <Board rows={rows} mode="dates" headerAt={0} />
    </div>
  );
};

/** Right-margin date chip: two lines, never over the chat column. */
export const SnapshotDateChip: React.FC<{ line1: string; line2: string; at: number; out?: number }> = ({ line1, line2, at, out }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  const o = out === undefined ? 0 : prog(f, out, 10);
  return (
    <div style={{
      position: 'absolute', right: 40, top: 230, width: 300, boxSizing: 'border-box', background: C.cream, color: C.ink, fontFamily: FONT_SANS, borderRadius: 18, padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,.45)', opacity: p * (1 - o), transform: `translateX(${lerp(60, 0, p)}px)`,
    }}>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{line1}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.red }}>{line2}</div>
    </div>
  );
};
