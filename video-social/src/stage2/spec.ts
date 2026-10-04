import { CutPlan, Rect, Scene, buildPlan } from '../lib/plan';
import { Format } from '../lib/format';

/** Stage 2 master timeline: 23 bars at 112 BPM = 92 beats = 1479 frames @30. */
export const TOTAL_FRAMES = 1479;
export const beatFrame = (beat: number): number => Math.round(beat * 16.0714);

/** Key dest frames (from the director's EDL). */
export const F = {
  hookEnd: 64,
  briefStart: 129,
  actReviewStart: 498,
  actApproveStart: 771,
  sentBack1: 852,
  sentBack2End: 1157,
  counterStart: 1157,
  impact: 1221,
  bridge: 1286,
  endCard: 1350,
  end: TOTAL_FRAMES,
} as const;

export type Box = { readonly left: number; readonly top: number; readonly w: number; readonly h: number };

/** hard: fill the frame. card: rounded sharp card (width w) over blurred bg. free: same as card but no border/shadow. blur: only the blurred bg. */
export type View =
  | { readonly kind: 'hard' }
  | { readonly kind: 'card'; readonly w: number; readonly top?: number }
  | { readonly kind: 'free'; readonly w: number; readonly top: number }
  | { readonly kind: 'blur' };

export type Extra = { readonly crop: Rect; readonly w: number; readonly left: number; readonly top: number };

export type Transition = 'whip' | 'punch' | 'none';

export type SceneSpec = {
  readonly id: string;
  /** dest frames [a, b) */
  readonly a: number;
  readonly b: number;
  /** source frame aligned with dest frame a */
  readonly src: number;
  readonly speed?: number;
  /** source frame at which the picture freezes */
  readonly freezeSrc?: number;
  readonly crop: Rect;
  readonly cropTo?: Rect;
  readonly view: View;
  readonly extra?: Extra;
  readonly transition?: Transition;
};

export const R = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });

/** Shrink a rect about its centre (push-in). z>1 zooms in. */
export const push = (r: Rect, z: number): Rect => ({ x: r.x + (r.w - r.w / z) / 2, y: r.y + (r.h - r.h / z) / 2, w: r.w / z, h: r.h / z });

const toScene = (s: SceneSpec): Scene => {
  const speed = s.speed ?? 1;
  const srcIn = s.src / 30;
  return {
    id: s.id,
    source: 'A',
    srcInSec: srcIn,
    srcOutSec: srcIn + ((s.b - s.a) * speed) / 30,
    speed: speed === 1 ? undefined : speed,
    freezeAtSec: s.freezeSrc === undefined ? undefined : s.freezeSrc / 30,
    crop: s.crop,
    cropTo: s.cropTo,
    layout: s.view.kind === 'hard' ? 'full-crop' : 'stack-blur',
  };
};

/** Plan for the engine's validator; overlays (captions, stamp, acts bar, end card) are drawn by Stage2Cut. */
export const buildStage2Plan = (format: Format, specs: readonly SceneSpec[]): CutPlan => {
  const plan = buildPlan({ format, scenes: specs.map(toScene), progressBar: false });
  if (plan.totalFrames !== TOTAL_FRAMES) throw new Error(`Stage2 ${format}: ${plan.totalFrames} frames != ${TOTAL_FRAMES}`);
  return plan;
};
