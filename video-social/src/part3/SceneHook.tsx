import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { prog, easeInOut } from '../lib/anim';
import { BOARD_ORDER, CREATORS } from './data';
import { Avatar, Bubble, Pill } from './kit';
import { countValue, fmtIN } from './Counter';
import { MorphTiles } from './tiles';
import { useLay } from './base';

const ROW_H = 64;
const BOARD_TOP = 184;
const FLIP_AT = 4;
const FLIP_STEP = 3;
const COLLAPSE_AT = 8;
const HERO_TOP = 292;

const Row: React.FC<{ k: string; i: number; f: number }> = ({ k, i, f }) => {
  const flipAt = FLIP_AT + (i - 4) * FLIP_STEP;
  const live = i < 4 || f >= flipAt;
  const flash = i >= 4 ? 1 - prog(f, flipAt, 10) : 0;
  const collapse = prog(f, COLLAPSE_AT + i * 0.5, 7, easeInOut);
  return (
    <div style={{ height: ROW_H, opacity: 1 - collapse, transform: `translateY(${-14 * collapse}px)`, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 20, borderBottom: `1.5px solid ${C.border}`, boxSizing: 'border-box' }}>
      <Avatar k={k} size={48} />
      <div style={{ fontFamily: FONT_SANS, fontSize: 44, fontWeight: 600, color: '#fff', flex: 1, whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{CREATORS[k].name}</div>
      <Pill size={36} dot={live} color={live ? '#5ed39d' : '#c8b4ff'} bg={live ? `rgba(63,178,127,${0.18 + 0.3 * flash})` : 'rgba(182,156,255,.17)'}>{live ? 'Live' : 'Scheduled'}</Pill>
    </div>
  );
};

/** f 0-179: board flip (4 Live -> 8 Live), bubble, hero counter 1,85,700, morph into the Impressions tile, three tiles. */
export const SceneHook: React.FC<{ f: number }> = ({ f }) => {
  const { dw } = useLay();
  const flipped = BOARD_ORDER.map((_, i) => i < 4 || f >= FLIP_AT + (i - 4) * FLIP_STEP).filter(Boolean).length;
  const chipText = f < FLIP_AT + 3 * FLIP_STEP + 1 ? 'Thu 8 Oct' : 'Fri 9 Oct 2026 · 8:00 PM';
  const pillsO = 1 - prog(f, 76, 8);
  const rowsGone = prog(f, COLLAPSE_AT, 14);
  const bubbleO = 1 - prog(f, 46, 8);
  const m = prog(f, 90, 16, easeInOut);
  const lock = f >= 60 ? Math.max(0, 1 - (f - 60) / 10) : 0;
  const value = fmtIN(countValue(f, 0, 185700, 36, 24));
  const heroVisible = f >= 34;
  const heroA = prog(f, 34, 4);
  return (
    <>
      <div style={{ position: 'absolute', right: 0, top: 0, opacity: 1 }}>
        <Pill size={44} color="#fff" bg="rgba(255,255,255,.10)" style={{ border: `1.5px solid ${C.border}` }}>{chipText}</Pill>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 84, opacity: pillsO, display: 'flex', gap: 16 }}>
        <Pill size={50} dot color="#5ed39d" bg="rgba(63,178,127,.20)">{flipped} Live</Pill>
        <Pill size={50} color="#c8b4ff" bg="rgba(182,156,255,.18)">{8 - flipped} Scheduled</Pill>
      </div>
      {rowsGone < 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: BOARD_TOP, width: dw }}>
          {BOARD_ORDER.map((k, i) => <Row key={k} k={k} i={i} f={f} />)}
        </div>
      )}
      {f >= 16 && f < 56 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 190, opacity: bubbleO }}>
          <Bubble f={f} at={16} text="How is it performing?" size={52} />
        </div>
      )}
      {heroVisible && (
        <div style={{ opacity: heroA }}>
          <MorphTiles
            f={f} m={m} popAt={[105, 112, 120]} heroTop={HERO_TOP} scale={1 + 0.05 * lock}
            set={{ impressions: value, likes: '2,955', comments: '238', eng: '1.72%' }}
          />
        </div>
      )}
    </>
  );
};
