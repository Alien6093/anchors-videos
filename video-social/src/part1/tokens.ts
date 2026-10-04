export const FPS = 30;
export const TOTAL = 1440;
export const BEAT_F = 15;
export const beat = (b: number): number => b * BEAT_F;

export type Fmt = '916' | '45';

export const BASE_W = 920;
/** Smallest font (base units) for text that must be read; x1.087 in 9:16 = 44.5px out. */
export const MIN_FONT = 42;

type Spec = {
  width: number; height: number;
  bandX: number; bandY: number; bandW: number; bandH: number;
  chipX: number; chipY: number; chipFont: number;
};

export const SPEC: Record<Fmt, Spec> = {
  '916': { width: 1080, height: 1920, bandX: 40, bandY: 600, bandW: 1000, bandH: 780, chipX: 60, chipY: 280, chipFont: 44 },
  '45': { width: 1080, height: 1350, bandX: 80, bandY: 340, bandW: 920, bandH: 930, chipX: 80, chipY: 80, chipFont: 36 },
};

export type SceneDef = { id: string; from: number; to: number };

export const SCENES: readonly SceneDef[] = [
  { id: 'hook', from: beat(0), to: beat(4) },
  { id: 'asks', from: beat(4), to: beat(8) },
  { id: 'plan', from: beat(8), to: beat(12) },
  { id: 'reach', from: beat(12), to: beat(20) },
  { id: 'creators', from: beat(20), to: beat(32) },
  { id: 'cut', from: beat(32), to: beat(44) },
  { id: 'drop', from: beat(44), to: beat(52) },
  { id: 'briefs', from: beat(52), to: beat(60) },
  { id: 'quote', from: beat(60), to: beat(64) },
  { id: 'pay', from: beat(64), to: beat(68) },
  { id: 'sent', from: beat(68), to: beat(76) },
  { id: 'recap', from: beat(76), to: beat(88) },
  { id: 'end', from: beat(88), to: beat(96) },
];

export const CHIP_END = beat(88);

export const CREATORS = [
  { first: 'Ashish', full: 'Ashish Shukla', city: 'Ahmedabad', file: 'photos/ashish-shukla.webp' },
  { first: 'Riya', full: 'Riya Dadhich', city: 'Mumbai', file: 'photos/riya-dadhich.webp' },
  { first: 'Gunjan', full: 'Gunjan Mishra', city: '', file: 'photos/gunjan-mishra.webp' },
  { first: 'Priyanshu', full: 'Priyanshu Manas', city: 'New Delhi', file: 'photos/priyanshu-manas.webp' },
  { first: 'Jyoti', full: 'Jyoti Vyas', city: 'Vadodara', file: 'photos/jyoti-vyas.webp' },
  { first: 'Sunidhi', full: 'Sunidhi', city: '', file: 'photos/sunidhi.webp' },
  { first: 'Shubhangi', full: 'Shubhangi Shrivastava', city: '', file: 'photos/shubhangi-shrivastava.webp' },
  { first: 'Darika', full: 'Darika Jain', city: '', file: 'photos/darika-jain.webp' },
] as const;

export const SANS_NUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };
import type React from 'react';
