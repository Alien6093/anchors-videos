import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, ChatShell, Counter, FONT_SANS, ToolLabel, UserBubble } from '../index';
import { WidgetHeader } from '../CleoWidget';
import { Tile } from '../b/Metrics';
import { Turn } from '../b/bits';
import { easeInOut, lerp, prog } from '../anim';
import { FORECAST_HIGH, FORECAST_LOW, RANK_ROWS, SNAP_TOTALS } from '../../lib/dataB';
import { ContextBlock } from './ContextBlock';
import { CrestNumber } from './CrestNumber';
import { ForecastBand } from './ForecastBand';
import { RankTable } from './RankTable';

/**
 * Chat for scenes 3-5 (and frozen under scene 6). Time base T = frames since scene 3 start (225).
 * Scene 4 starts at T=161, scene 5 at T=289, scene 6 at T=354.
 */
export const S4_T = 161;
export const S5_T = 289;
const SCROLL_END = S5_T + 16; // pacing card scrolls in over 16 frames (was 25) so the 67-69% readout is on screen when it reveals at f524
const DIM = 0.35;
const S2_LEN = 96;

const SCROLL: [number, number][] = [[0, -100], [22, 600], [161, 600], [188, 1250], [289, 1250], [SCROLL_END, 1737]];
const scrollAt = (T: number): number => {
  for (let i = 1; i < SCROLL.length; i++) {
    const [t0, v0] = SCROLL[i - 1];
    const [t1, v1] = SCROLL[i];
    if (T <= t1) return lerp(v0, v1, easeInOut(Math.min(1, Math.max(0, (T - t0) / (t1 - t0)))));
  }
  return SCROLL[SCROLL.length - 1][1];
};

const TILE_AT = 80;
const CHIP_FADE_AT = 20; // tool chip clears 6 frames before the crest number (fadeInAt 28) arrives
const READOUT_AT = 10; // scene 5 local: f524, 17.45 s

type Props = { extraDim?: number };

const SnapTiles: React.FC = () => {
  const T = useCurrentFrame();
  const settle = (at: number) => lerp(1, DIM, prog(T, at + 26, 14));
  const blockDim = lerp(1, DIM, prog(T, 150, 22));
  return (
    <div style={{ marginLeft: -100, width: 1300, marginBottom: 20, opacity: blockDim }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Tile label="Impressions" at={TILE_AT}><Counter value={185700} start={0} duration={1} /></Tile>
        <div style={{ flex: 1, display: 'flex', opacity: settle(TILE_AT + 5) }}><Tile label="Likes" at={TILE_AT + 5}><Counter value={2955} start={TILE_AT + 5} duration={30} /></Tile></div>
        <div style={{ flex: 1, display: 'flex', opacity: settle(TILE_AT + 10) }}><Tile label="Comments" at={TILE_AT + 10}><Counter value={238} start={TILE_AT + 10} duration={30} /></Tile></div>
      </div>
      <div style={{ display: 'flex', gap: 16, opacity: 1 }}>
        <div style={{ flex: 1, display: 'flex', opacity: settle(TILE_AT + 15) }}><Tile label="Engagement rate" at={TILE_AT + 15}><Counter value={1.72} start={TILE_AT + 15} duration={30} decimals={2} suffix="%" /></Tile></div>
        <div style={{ flex: 1, display: 'flex', opacity: settle(TILE_AT + 20) }}><Tile label="Posts live" at={TILE_AT + 20}>8 of 8</Tile></div>
      </div>
      <div style={{ marginTop: 16, fontFamily: FONT_SANS, fontSize: 26, color: C.muted, opacity: prog(T, TILE_AT + 26, 10) * 0.6 }}>Data as of Fri 9 Oct 2026, 8:00 PM</div>
    </div>
  );
};

const SnapTable: React.FC = () => {
  const T = useCurrentFrame();
  const L = T - S4_T;
  const dimOthers = prog(L, 60, 14);
  const hi = prog(L, 66, 10);
  const ping = L >= 79 && L < 95 ? Math.sin(((L - 79) / 16) * Math.PI) : 0;
  const dimAll = lerp(1, 0.5, prog(T, S5_T, 14));
  const rowDim: Record<string, number> = {};
  RANK_ROWS.forEach((r) => { rowDim[r.key] = r.key === 'priyanshu' || r.key === 'darika' ? 1 : lerp(1, DIM, dimOthers); });
  const cream = { priyanshu: hi, darika: hi };
  const pulse = { priyanshu: ping, darika: ping };
  const rack = prog(T, S5_T, 14);
  return (
    <div style={{ marginLeft: -250, opacity: dimAll, filter: rack > 0.02 ? `blur(${rack * 12}px)` : undefined }}>
      <RankTable rows={RANK_ROWS} enterAt={S4_T + 16} stagger={3} flip={0} mix={0} rowDim={rowDim} cream={cream} pulse={pulse} today={prog(L, 66, 12)} />
    </div>
  );
};

const PacingCard: React.FC = () => {
  const T = useCurrentFrame();
  const L = T - S5_T;
  const p = prog(L, 0, 16);
  const marker = 185700 * prog(L, 4, 40);
  const lockTick = prog(L, 47, 10);
  const readout = prog(L, READOUT_AT, 12);
  // 67-69% is marker / forecast high .. marker / forecast low, so it counts up with the marker
  const pctLo = Math.round((marker / FORECAST_HIGH) * 100);
  const pctHi = Math.round((marker / FORECAST_LOW) * 100);
  return (
    <div style={{ width: 1100, background: C.cream, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.45)', opacity: p, transform: `translateY(${lerp(80, 0, p)}px)` }}>
      <div style={{ background: C.creamHead, padding: '22px 34px 18px' }}><WidgetHeader /></div>
      <div style={{ padding: '54px 50px 8px' }}>
        <ForecastBand variant="cream" width={1000} value={marker} bandOpacity={DIM + 0.1} tickOpacity={DIM} tick={lockTick} />
      </div>
      <div style={{ padding: '0 50px 34px', fontFamily: FONT_SANS, opacity: readout, transform: `translateY(${lerp(20, 0, readout)}px) scale(${1 + 0.03 * Math.sin(lockTick * Math.PI)})`, transformOrigin: 'left center' }}>
        <span style={{ fontSize: 64, fontWeight: 800, color: C.ink, letterSpacing: '-0.03em' }}><span style={{ fontVariantNumeric: 'tabular-nums' }}>{pctLo}</span>-<span style={{ fontVariantNumeric: 'tabular-nums' }}>{pctHi}</span>% of forecast</span>
        <span style={{ fontSize: 40, color: C.inkSoft, marginLeft: 14 }}>so far</span>
      </div>
    </div>
  );
};

export const SnapChat: React.FC<Props> = ({ extraDim = 0 }) => {
  const T = useCurrentFrame();
  const scroll = scrollAt(T);
  const punch = prog(T, 26, 14) * (1 - prog(T, TILE_AT, 14));
  const dimPunch = 0.7 * punch;
  const x = lerp(-50, 0, easeInOut(prog(T, 0, 24)));
  const s4 = lerp(1, 1.06, prog(T, S4_T, S5_T - S4_T, (t) => t));
  const s5 = lerp(1.06, 1.02, easeInOut(prog(T, S5_T, 20)));
  const scale = T < S5_T ? s4 * (1 + 0.1 * punch) : s5;
  const contextDim = lerp(1, DIM, prog(T, 0, 10));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={Math.max(dimPunch, extraDim)} camera={{ scale, x }}>
        <div style={{ opacity: contextDim }}>
          <Sequence from={-S2_LEN} layout="none"><ContextBlock /></Sequence>
        </div>
        <div style={{ height: 30 }} />
        <Turn><UserBubble text="How is it performing?" enterAt={4} /></Turn>
        <Turn><div style={{ opacity: 1 - prog(T, CHIP_FADE_AT, 8) * (1 - prog(T, TILE_AT, 14)) }}><ToolLabel name="CLEO - How the campaign is performing" start={10} doneAt={30} /></div></Turn>
        <SnapTiles />
        <div style={{ height: 30 }} />
        <Turn><ToolLabel name="CLEO - How each creator performed" start={S4_T} doneAt={S4_T + 14} /></Turn>
        <SnapTable />
        <div style={{ height: 40 }} />
        <PacingCard />
      </ChatShell>
      <CrestNumber from={0} to={SNAP_TOTALS.imp} fadeInAt={28} rampAt={32} rampDur={28} lockAt={TILE_AT} pullAt={TILE_AT} pullX={-420} pullY={-60} />
    </AbsoluteFill>
  );
};

