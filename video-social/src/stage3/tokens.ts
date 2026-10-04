import { Format } from '../lib/format';

export const ACCENT = '#F2803A';
export const NEAR_BLACK = '#0a0a0a';
export const TOTAL_FRAMES = 1479;
export const BEAT_F = (30 * 60) / 112; // 16.0714 frames per beat
/** Frame of output beat n on the 112 BPM grid. */
export const beatF = (n: number): number => Math.round(n * BEAT_F);

export const W = 1080;
export const H: Record<Format, number> = { '916': 1920, '45': 1350 };

/** Scene start frames (output). */
export const T = {
  hookEnd: 48,
  hookBlackEnd: 64,
  s2: 64, s3: 129, s4: 257, s5: 321, s6: 579, s7: 707, s8: 836, s9: 964, s10: 1157, s11: 1350, end: 1479,
  lock1: 177, lock1End: 182,
  lock2: 417, lock2End: 423,
  bridgeStart: 1467,
} as const;

export const is916 = (f: Format): boolean => f === '916';
