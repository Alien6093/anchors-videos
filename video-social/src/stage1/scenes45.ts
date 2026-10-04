import { Scene } from '../lib/plan';
import { formatRect } from '../lib/crop';
import { CROP, T, mkScene, r, scaleRect, BRIGHT_BG } from './build';

const A = 4 / 5;
const W = 920;
const STACK = { cardWidth: W, cardTop: 330 } as const;
const PAY = { cardWidth: W, cardTop: 330, bgBrightness: BRIGHT_BG } as const;
const PLAN_PUSH = scaleRect(CROP.plan, 0.92);
const HOOK_HOLD = 35; // b2.2

/** Stage 1, 4:5: longer holds, slow push-ins, no HARD macros except the blank-chat title. */
export const scenes45: readonly Scene[] = [
  mkScene({ id: 'h1', f0: T.b0, f1: HOOK_HOLD, src: [118.8, 118.8], freeze: 118.8, crop: CROP.board, cropTo: r(392, 182, 1136, 666), stack: STACK }),
  mkScene({ id: 'h2', f0: HOOK_HOLD, f1: T.b3, src: [73.5, 73.5], freeze: 73.5, crop: CROP.pay, stack: PAY }),
  mkScene({ id: 'h4', f0: T.b3, f1: T.b4, src: [4.42, 4.72], crop: formatRect(A, CROP.chatBlank), hard: true }),
  mkScene({ id: 'p1', f0: T.b4, f1: 136, src: [5.1, 7.5], crop: CROP.typing, stack: STACK }),
  mkScene({ id: 'p2a', f0: 136, f1: 153, src: [7.5, 8.05], crop: CROP.prompt, stack: STACK }),
  mkScene({ id: 'p2', f0: 153, f1: T.b11, src: [8.05, 8.05], freeze: 8.05, crop: CROP.prompt, stack: STACK }),
  mkScene({ id: 'c1', f0: T.b11, f1: T.b19, src: [10.6, 14.6], crop: r(380, 40, 1160, 720), cropTo: scaleRect(r(380, 40, 1160, 720), 0.96), stack: STACK }),
  mkScene({ id: 's4a', f0: T.b19, f1: T.b21, src: [16.4, 18.5], crop: CROP.plan, stack: STACK }),
  mkScene({ id: 'pj1', f0: T.b21, f1: 427, src: [18.5, 21.5], crop: CROP.plan, cropTo: PLAN_PUSH, stack: STACK }),
  mkScene({ id: 'pj3', f0: 427, f1: 439, src: [21.5, 21.5], freeze: 21.5, crop: PLAN_PUSH, stack: STACK }),
  mkScene({ id: 'pj4', f0: 439, f1: T.b29, src: [21.5, 22.8], crop: PLAN_PUSH, stack: STACK }),
  mkScene({ id: 'cr1', f0: T.b29, f1: T.b37, src: [23.4, 27.4], crop: CROP.creators, cropTo: scaleRect(CROP.creators, 0.94), stack: STACK }),
  mkScene({ id: 'k1', f0: T.b37, f1: 646, src: [38.3, 40.65], crop: CROP.cutTyping, stack: STACK }),
  mkScene({ id: 'k2', f0: 646, f1: 668, src: [41.4, 42.1], crop: CROP.bubble, stack: STACK }),
  mkScene({ id: 'k3a', f0: 668, f1: 677, src: [42.0, 42.3], crop: CROP.names, stack: STACK }),
  mkScene({ id: 'k3', f0: 677, f1: T.b44, src: [42.3, 42.3], freeze: 42.3, crop: CROP.names, stack: STACK }),
  mkScene({ id: 'e1', f0: T.b44, f1: T.b47, src: [43.4, 45.0], crop: r(400, 250, 1120, 520), cropTo: r(440, 300, 1040, 440), stack: STACK }),
  mkScene({ id: 'e2', f0: T.b47, f1: T.b50, src: [46.5, 49.2], crop: CROP.roster, stack: STACK }),
  mkScene({ id: 'e3', f0: T.b50, f1: T.b52, src: [49.3, 49.3], freeze: 49.3, crop: CROP.roster, cropTo: scaleRect(CROP.roster, 0.96), stack: STACK }),
  mkScene({ id: 'b1', f0: T.b52, f1: T.b54, src: [49.9, 50.9], crop: CROP.pills, stack: STACK }),
  mkScene({ id: 'b2', f0: T.b54, f1: T.b60, src: [51.3, 56.8], crop: CROP.brief, stack: STACK }),
  mkScene({ id: 'q1', f0: T.b60, f1: T.b64, src: [66.4, 69.5], crop: CROP.quote, stack: STACK }),
  mkScene({ id: 'pay', f0: T.b64, f1: T.b68, src: [70.7, 73.4], crop: r(300, 40, 1320, 860), stack: PAY, transitionIn: 'flash' }),
  mkScene({ id: 'dt', f0: T.b68, f1: T.b74, src: [110.9, 114.9], crop: CROP.dates, stack: STACK }),
  mkScene({ id: 'f1', f0: T.b74, f1: T.b77, src: [114.95, 116.25], crop: CROP.feed, stack: STACK }),
  mkScene({ id: 'f2', f0: T.b77, f1: T.b84, src: [116.9, 119.9], crop: CROP.board, cropTo: scaleRect(CROP.board, 0.96), stack: STACK }),
  mkScene({ id: 'tz', f0: T.b84, f1: T.b88, src: [119.8, 119.8], freeze: 119.8, crop: scaleRect(CROP.board, 0.96), cropTo: scaleRect(CROP.board, 1.12), stack: STACK }),
  mkScene({ id: 'en', f0: T.b88, f1: T.b96, src: [119.8, 119.8], freeze: 119.8, crop: CROP.board, stack: STACK }),
];
