import { Easing, interpolate, spring } from 'remotion';
import { BEAT } from '../components/theme';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0..1 progress between start and start+dur, clamped, eased. */
export const prog = (f: number, start: number, dur: number, easing: (t: number) => number = easeOut): number =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Spring with overshoot, starting at delay. */
export const pop = (f: number, delay: number, damping = 12, stiffness = 150, mass = 0.7): number =>
  spring({ frame: f - delay, fps: 30, config: { damping, stiffness, mass } });

/** Map a 0..1 value to a range. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Indian digit grouping: 280000 -> 2,80,000 */
export const fmtIN = (n: number): string => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${last3}`;
};

export const parseIN = (s: string): number => Number(s.replace(/,/g, ''));

/** Snap a local frame to the nearest beat of the global 112 BPM grid. */
export const onBeat = (sceneStartSec: number, approxLocal: number): number => {
  const startF = Math.round(sceneStartSec * 30);
  const abs = startF + approxLocal;
  const snapped = Math.round(abs / BEAT) * BEAT;
  return Math.round(snapped - startF);
};

export type Pause = { at: number; frames: number };

/** Characters visible for typing animation with optional pauses (at = char index). */
export const typedCount = (len: number, f: number, start: number, cps: number, pauses: Pause[] = []): number => {
  const t = f - start;
  if (t < 0) return 0;
  const perChar = 30 / cps;
  let n = 0;
  let cursor = 0;
  for (let i = 0; i < len; i++) {
    const p = pauses.find((x) => x.at === i);
    if (p) cursor += p.frames;
    cursor += perChar;
    if (t >= cursor) n = i + 1;
    else break;
  }
  return n;
};

export type Step<T> = { at: number; v: T };
/** Value of a stepped timeline at frame f (last step with at <= f). */
export const stepAt = <T,>(steps: Step<T>[], f: number): T => {
  let cur = steps[0].v;
  for (const s of steps) if (f >= s.at) cur = s.v;
  return cur;
};
/** Frame at which the latest applied step began (or -Infinity). */
export const lastChange = <T,>(steps: Step<T>[], f: number): number => {
  let at = -999;
  for (let i = 1; i < steps.length; i++) if (f >= steps[i].at) at = steps[i].at;
  return at;
};
