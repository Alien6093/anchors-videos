import type { ComponentType } from 'react';
import { FPS, FORMATS, Format, SRC_H, SRC_W } from './format';

export type SourceId = 'v4' | 'A' | 'B';
export type Layout = 'full-crop' | 'stack-blur';
export type TransitionType = 'none' | 'whip' | 'zoom-punch' | 'flash';
export type CaptionStyle = 'pop' | 'accent' | 'number';
export type CaptionPosition = 'upper' | 'middle' | 'lower';
export type Arrow = 'up' | 'down' | 'left' | 'right' | 'none';
export type CalloutTone = 'cream' | 'green' | 'orange';

/** Rect in source pixels (1920x1080). */
export type Rect = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

export type Caption = {
  readonly text: string;
  /** seconds relative to scene start (output time) */
  readonly inSec: number;
  readonly outSec: number;
  readonly style?: CaptionStyle;
  readonly position?: CaptionPosition;
};

export type Callout = {
  readonly text: string;
  readonly inSec: number;
  readonly outSec: number;
  /** center of the sticker, fraction of frame (0..1); clamped to the safe area */
  readonly x: number;
  readonly y: number;
  readonly arrow?: Arrow;
  readonly tone?: CalloutTone;
};

/** Optional stack-blur tuning (backwards compatible; defaults match the engine). */
export type StackOptions = { readonly cardWidth?: number; readonly cardTop?: number; readonly bgBrightness?: number };

export type Scene = {
  readonly stack?: StackOptions;
  readonly id: string;
  readonly source: SourceId;
  readonly srcInSec: number;
  readonly srcOutSec: number;
  /** playback rate, default 1 */
  readonly speed?: number;
  /** source time at which the clip freezes and holds until scene end */
  readonly freezeAtSec?: number;
  readonly crop: Rect;
  /** if set, crop window eases from `crop` to `cropTo` across the scene (punch-in) */
  readonly cropTo?: Rect;
  readonly layout: Layout;
  readonly transitionIn?: TransitionType;
  /** optional output start (seconds); validated against the contiguous timeline */
  readonly startSec?: number;
  readonly caption?: Caption;
  readonly callouts?: readonly Callout[];
};

export type Hook = { readonly text: string; readonly durationSec?: number };
export type EndCardSpec = { readonly durationSec: number; readonly tagline: string; readonly cta: string; readonly sub?: string };

export type CutPlan = {
  readonly format: Format;
  readonly fps: 30;
  readonly totalFrames: number;
  readonly scenes: readonly Scene[];
  readonly hook?: Hook;
  readonly endCard?: EndCardSpec;
  readonly progressBar?: boolean;
  /** optional stage-specific overlay component drawn above everything (uses useCurrentFrame) */
  readonly overlay?: ComponentType<{ readonly format: Format }>;
};

export const secToFrame = (sec: number): number => Math.round(sec * FPS);
export const frameToSec = (frame: number): number => frame / FPS;

export const sceneSpeed = (s: Scene): number => s.speed ?? 1;

/** Output duration of a scene in frames. */
export const sceneFrames = (s: Scene): number => Math.max(1, secToFrame((s.srcOutSec - s.srcInSec) / sceneSpeed(s)));

export const sumFrames = (scenes: readonly Scene[]): number => scenes.reduce((n, s) => n + sceneFrames(s), 0);

export type PlacedScene = { readonly scene: Scene; readonly from: number; readonly frames: number };

/** Scenes with their cumulative start frame. */
export const placeScenes = (scenes: readonly Scene[]): readonly PlacedScene[] =>
  scenes.reduce<readonly PlacedScene[]>((acc, scene) => {
    const last = acc[acc.length - 1];
    const from = last ? last.from + last.frames : 0;
    return [...acc, { scene, from, frames: sceneFrames(scene) }];
  }, []);

/** Build a plan whose totalFrames is derived from its scenes. */
export const buildPlan = (p: Omit<CutPlan, 'fps' | 'totalFrames'>): CutPlan => ({ ...p, fps: 30, totalFrames: sumFrames(p.scenes) });

export const SOURCE_FILES: Record<SourceId, string> = { v4: 'src/v4.mp4', A: 'src/A.mp4', B: 'src/B.mp4' };
export const SOURCE_DURATION_SEC: Record<SourceId, number> = { v4: 150, A: 60, B: 60 };

const ASPECT_TOLERANCE = 0.02;
const rectAspect = (r: Rect): number => r.w / r.h;

const rectErrors = (label: string, r: Rect): string[] => {
  const errs: string[] = [];
  if (r.w <= 0 || r.h <= 0) errs.push(`${label}: non-positive size`);
  if (r.x < 0 || r.y < 0 || r.x + r.w > SRC_W + 0.5 || r.y + r.h > SRC_H + 0.5) errs.push(`${label}: outside ${SRC_W}x${SRC_H} source (${JSON.stringify(r)})`);
  return errs;
};

const sceneErrors = (s: Scene, from: number, frames: number, format: Format): string[] => {
  const tag = `scene "${s.id}"`;
  const errs: string[] = [];
  const sceneSec = frames / FPS;
  if (s.srcOutSec <= s.srcInSec) errs.push(`${tag}: srcOutSec must be > srcInSec`);
  if (s.srcInSec < 0 || s.srcOutSec > SOURCE_DURATION_SEC[s.source]) errs.push(`${tag}: source range outside ${s.source} (0..${SOURCE_DURATION_SEC[s.source]}s)`);
  if (s.speed !== undefined && s.speed <= 0) errs.push(`${tag}: speed must be > 0`);
  if (s.freezeAtSec !== undefined && (s.freezeAtSec < s.srcInSec || s.freezeAtSec > s.srcOutSec)) errs.push(`${tag}: freezeAtSec outside source range`);
  if (s.startSec !== undefined && secToFrame(s.startSec) !== from) errs.push(`${tag}: startSec ${s.startSec}s != contiguous start ${frameToSec(from).toFixed(3)}s (gap/overlap)`);
  const rects: [string, Rect][] = [[`${tag} crop`, s.crop], ...(s.cropTo ? ([[`${tag} cropTo`, s.cropTo]] as [string, Rect][]) : [])];
  for (const [label, r] of rects) {
    errs.push(...rectErrors(label, r));
    if (s.layout === 'full-crop') {
      const target = FORMATS[format].width / FORMATS[format].height;
      if (Math.abs(rectAspect(r) / target - 1) > ASPECT_TOLERANCE) errs.push(`${label}: aspect ${rectAspect(r).toFixed(3)} must match ${target.toFixed(3)} for full-crop`);
    }
  }
  const timed = [...(s.caption ? [{ n: 'caption', i: s.caption.inSec, o: s.caption.outSec }] : []), ...(s.callouts ?? []).map((c, i) => ({ n: `callout ${i}`, i: c.inSec, o: c.outSec }))];
  for (const t of timed) if (t.i < 0 || t.o <= t.i || t.o > sceneSec + 0.05) errs.push(`${tag} ${t.n}: times ${t.i}-${t.o}s must lie within scene (0..${sceneSec.toFixed(2)}s)`);
  return errs;
};

/** Returns a list of human-readable problems (empty = valid). */
export const validatePlan = (plan: CutPlan): string[] => {
  const errs: string[] = [];
  if (plan.fps !== 30) errs.push('fps must be 30');
  if (plan.scenes.length === 0) errs.push('plan has no scenes');
  const ids = plan.scenes.map((s) => s.id);
  if (new Set(ids).size !== ids.length) errs.push('scene ids must be unique');
  const placed = placeScenes(plan.scenes);
  for (const p of placed) errs.push(...sceneErrors(p.scene, p.from, p.frames, plan.format));
  const sum = sumFrames(plan.scenes);
  if (sum !== plan.totalFrames) errs.push(`totalFrames ${plan.totalFrames} != sum of scenes ${sum}`);
  if (plan.endCard && secToFrame(plan.endCard.durationSec) > plan.totalFrames) errs.push('endCard longer than plan');
  return errs;
};

export const assertValidPlan = (plan: CutPlan, label: string): CutPlan => {
  const errs = validatePlan(plan);
  if (errs.length > 0) throw new Error(`Invalid plan ${label}:\n - ${errs.join('\n - ')}`);
  return plan;
};
