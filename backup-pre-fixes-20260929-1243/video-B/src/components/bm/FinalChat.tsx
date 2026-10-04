import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, ToolLabel, UserBubble } from '../index';
import { Tile } from '../b/Metrics';
import { Turn } from '../b/bits';
import { easeInOut, lerp, prog } from '../anim';
import { FINAL_TOTALS, RANK_ROWS, SNAP_TOTALS } from '../../lib/dataB';
import { CountFromTo } from './CountFromTo';
import { CrestNumber } from './CrestNumber';
import { RankTable } from './RankTable';

/**
 * Chat for scenes 7-8. Time base T = frames since scene 7 start (643); scene 8 starts at T=257.
 */
export const S8_T = 257;
const DIM = 0.35;
const PULL_AT = 128;
const CPM_AT = 178;

const SCROLL: [number, number][] = [[0, -100], [S8_T, -100], [S8_T + 46, 500], [S8_T + 129, 530]];
const scrollAt = (T: number): number => {
  for (let i = 1; i < SCROLL.length; i++) {
    const [t0, v0] = SCROLL[i - 1];
    const [t1, v1] = SCROLL[i];
    if (T <= t1) return lerp(v0, v1, easeInOut(Math.min(1, Math.max(0, (T - t0) / (t1 - t0)))));
  }
  return SCROLL[SCROLL.length - 1][1];
};

const Tiles: React.FC = () => {
  const T = useCurrentFrame();
  const at = (i: number) => PULL_AT + i * 6;
  const settle = (i: number) => lerp(1, DIM, prog(T, at(i) + 28, 14));
  const impDim = lerp(1, 0.55, prog(T, CPM_AT, 14));
  const cpmOn = prog(T, CPM_AT, 12);
  const cpmGlow = cpmOn * (1 - prog(T, 236, 21)) * (0.85 + 0.15 * Math.sin(T / 4));
  const cpmOpacity = lerp(settle(4), 1, cpmOn) * lerp(1, 0.7, prog(T, 240, 17));
  const tilesDim = lerp(1, 0.5, prog(T, S8_T, 16));
  const count = (i: number, from: number, to: number, decimals = 0, prefix = '') => (
    <CountFromTo from={from} to={to} start={at(i)} duration={40} decimals={decimals} prefix={prefix} />
  );
  return (
    <div style={{ marginLeft: -100, width: 1300, marginBottom: 20, opacity: tilesDim }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, display: 'flex', opacity: impDim }}><Tile label="Impressions" at={at(0)}><CountFromTo from={FINAL_TOTALS.imp} to={FINAL_TOTALS.imp} start={0} duration={1} /></Tile></div>
        <div style={{ flex: 1, display: 'flex', opacity: settle(1) }}><Tile label="Likes" at={at(1)}>{count(1, SNAP_TOTALS.likes, FINAL_TOTALS.likes)}</Tile></div>
        <div style={{ flex: 1, display: 'flex', opacity: settle(2) }}><Tile label="Comments" at={at(2)}>{count(2, SNAP_TOTALS.comments, FINAL_TOTALS.comments)}</Tile></div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', opacity: settle(3) }}><Tile label="Engagement rate" at={at(3)}>{count(3, SNAP_TOTALS.eng, FINAL_TOTALS.eng, 2)}%</Tile></div>
        <div style={{ flex: 1.2, display: 'flex', opacity: cpmOpacity }}>
          <Tile label="Effective CPM" at={at(4)} glow={cpmGlow} glowRGB="232,116,59" sub="plan Rs 540">Rs <CountFromTo from={0} to={525} start={at(4)} duration={40} /></Tile>
        </div>
        <div style={{ flex: 1.7, display: 'flex', opacity: settle(5) }}>
          <Tile label="Budget used" at={at(5)} sub="of Rs 1,50,000" bar={prog(T, at(5) + 6, 40)}>Rs <CountFromTo from={0} to={147000} start={at(5)} duration={44} /></Tile>
        </div>
      </div>
    </div>
  );
};

const FinalTable: React.FC = () => {
  const T = useCurrentFrame();
  const L = T - S8_T;
  const flip = prog(L, 30, 34, easeInOut);
  const mix = prog(L, 30, 50);
  const brighten = prog(L, 34, 20);
  const settleHi = prog(L, 66, 12);
  const rowDim: Record<string, number> = {};
  RANK_ROWS.forEach((r) => {
    const own = r.key === 'darika' ? lerp(DIM, 1, brighten) : r.key === 'jyoti' ? lerp(DIM, 1, settleHi) : DIM;
    rowDim[r.key] = prog(L, 0, 8) > 0 ? own : DIM;
  });
  const lockAt = 113;
  const flash = L >= lockAt && L < lockAt + 20 ? 1 - (L - lockAt) / 20 : 0;
  const totalsMix = prog(L, 30, 50);
  const totalsOp = lerp(DIM, 1, prog(L, lockAt - 6, 6));
  return (
    <div style={{ marginLeft: -200 }}>
      <RankTable
        rows={RANK_ROWS} enterAt={S8_T} stagger={2} flip={flip} mix={mix} rowDim={rowDim} accent={settleHi} showTotals
        totals={{ snap: SNAP_TOTALS, fin: FINAL_TOTALS, mix: totalsMix, opacity: totalsOp * prog(L, 4, 10), flash }}
      />
      <div style={{ marginTop: 16, fontFamily: FONT_SANS, fontSize: 26, color: C.muted, opacity: prog(L, 100, 12) }}>Data as of Fri 23 Oct 2026</div>
    </div>
  );
};

export const FinalChat: React.FC = () => {
  const T = useCurrentFrame();
  const scroll = scrollAt(T);
  const punch = prog(T, 26, 14) * (1 - prog(T, PULL_AT, 14));
  const drift = lerp(1, 1.02, prog(T, PULL_AT, S8_T - PULL_AT, (t) => t));
  const scale = T < S8_T ? drift * (1 + 0.1 * punch) : lerp(1.02, 1.0, prog(T, S8_T, 30));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={0.7 * punch} camera={{ scale }}>
        <Turn><UserBubble text="Update me." enterAt={4} /></Turn>
        <Turn><ToolLabel name="CLEO - How the campaign is performing" start={10} doneAt={30} /></Turn>
        <Tiles />
        <div style={{ height: 24 }} />
        <Turn><ToolLabel name="CLEO - How each creator performed" start={S8_T} doneAt={S8_T + 14} /></Turn>
        <FinalTable />
      </ChatShell>
      <CrestNumber from={SNAP_TOTALS.imp} to={FINAL_TOTALS.imp} fadeInAt={28} rampAt={32} rampDur={64} lockAt={96} pullAt={PULL_AT} pullX={-440} pullY={-85} warm />
    </AbsoluteFill>
  );
};
