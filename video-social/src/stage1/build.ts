import { Rect, Scene, StackOptions, TransitionType } from '../lib/plan';
import { FPS } from '../lib/format';

/** Beat-grid frame boundaries from social_plan_stage1.md (112 BPM, 1543 frames). */
export const T = {
  b0: 0, b1: 16, b2: 32, b3: 48, b4: 64, b11: 177, b19: 305, b21: 337, b29: 466, b37: 595, b40h: 651, b44: 707,
  b47: 755, b50: 804, b52: 836, b54: 868, b60: 964, b64: 1029, b68: 1093, b74: 1189, b77: 1237, b84: 1350, b88: 1414, b96: 1543,
} as const;

export type SceneSpec = {
  readonly id: string;
  readonly f0: number;
  readonly f1: number;
  /** source seconds [in, out]; speed is derived so the scene lasts exactly f1-f0 frames */
  readonly src: readonly [number, number];
  readonly crop: Rect;
  readonly cropTo?: Rect;
  readonly stack?: StackOptions;
  /** hold this source time until the scene end */
  readonly freeze?: number;
  readonly hard?: boolean;
  readonly transitionIn?: TransitionType;
};

/** A scene from a beat-exact frame span; `freeze` scenes are pure holds unless src spans more time. */
export const mkScene = (s: SceneSpec): Scene => {
  const frames = s.f1 - s.f0;
  const srcIn = s.src[0];
  const srcOut = s.freeze !== undefined && s.src[1] === s.src[0] ? srcIn + frames / FPS : s.src[1];
  return {
    id: s.id,
    source: 'v4',
    srcInSec: srcIn,
    srcOutSec: srcOut,
    speed: ((srcOut - srcIn) * FPS) / frames,
    freezeAtSec: s.freeze,
    crop: s.crop,
    cropTo: s.cropTo,
    layout: s.hard ? 'full-crop' : 'stack-blur',
    stack: s.stack,
    transitionIn: s.transitionIn,
  };
};

export const r = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });

/** Scales a rect about its centre. */
export const scaleRect = (c: Rect, k: number): Rect => ({ x: c.x + (c.w - c.w * k) / 2, y: c.y + (c.h - c.h * k) / 2, w: c.w * k, h: c.h * k });

/** Crops shared by both formats (source px). */
export const CROP = {
  board: r(380, 180, 1160, 680),
  pay: r(300, 40, 1320, 860),
  roster: r(400, 200, 1120, 740),
  plan: r(340, 5, 1300, 925),
  creators: r(300, 0, 1440, 1020),
  prompt: r(620, 40, 960, 250),
  typing: r(370, 880, 1180, 200),
  bubble: r(630, 135, 890, 165),
  names: r(380, 430, 1160, 290),
  cutTyping: r(380, 60, 1160, 1000),
  pills: r(380, 90, 1160, 560),
  brief: r(360, 30, 1200, 900),
  quote: r(380, 90, 1160, 520),
  dates: r(380, 100, 1160, 720),
  feed: r(300, 150, 1320, 780),
  chatBlank: 960,
} as const;

export const BRIGHT_BG = 0.93;
