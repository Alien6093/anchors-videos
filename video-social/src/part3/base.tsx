import React, { createContext, useContext } from 'react';
import { useCurrentFrame } from 'remotion';

export type Fmt = '916' | '45';

export type Lay = {
  fmt: Fmt;
  W: number;
  H: number;
  card: { x: number; y: number; w: number; h: number };
  chip: { x: number; y: number; font: number };
  cap: { x: number; y: number; w: number; h: number; font: number };
  /** width of the design box inside the card */
  dw: number;
};

/** Height of the design box that every scene is laid out in (centred in the card). */
export const DH = 700;

export const LAYOUT: Record<Fmt, Lay> = {
  '916': { fmt: '916', W: 1080, H: 1920, card: { x: 40, y: 600, w: 1000, h: 780 }, chip: { x: 60, y: 280, font: 44 }, cap: { x: 60, y: 360, w: 960, h: 210, font: 96 }, dw: 880 },
  '45': { fmt: '45', W: 1080, H: 1350, card: { x: 80, y: 340, w: 920, h: 930 }, chip: { x: 80, y: 80, font: 36 }, cap: { x: 80, y: 150, w: 920, h: 150, font: 60 }, dw: 820 },
};

export const LayCtx = createContext<Lay>(LAYOUT['916']);
export const useLay = (): Lay => useContext(LayCtx);

/** Frame override, used for the loop-seam underlay (renders the f0 state while the end card dips). */
const FrameCtx = createContext<number | null>(null);
export const FrameOverride = FrameCtx.Provider;
export const useF = (): number => {
  const o = useContext(FrameCtx);
  const f = useCurrentFrame();
  return o ?? f;
};

export const BEAT_F = 15;
export const bf = (beat: number): number => beat * BEAT_F;
