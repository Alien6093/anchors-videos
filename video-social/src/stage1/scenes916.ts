import { Scene } from '../lib/plan';
import { formatRect } from '../lib/crop';
import { CROP, T, mkScene, r, scaleRect, BRIGHT_BG } from './build';

const A = 9 / 16;
const STACK = { cardTop: 580 } as const;
const PAY = { cardTop: 580, bgBrightness: BRIGHT_BG } as const;

/** Stage 1, 9:16: extra punch cuts on the beat, HARD macros on big type only. */
export const scenes916: readonly Scene[] = [
  mkScene({ id: 'h1', f0: T.b0, f1: T.b1, src: [118.8, 118.8], freeze: 118.8, crop: CROP.board, cropTo: r(392, 182, 1136, 666), stack: STACK }),
  mkScene({ id: 'h2', f0: T.b1, f1: T.b2, src: [73.5, 73.5], freeze: 73.5, crop: CROP.pay, stack: PAY }),
  mkScene({ id: 'h3', f0: T.b2, f1: T.b3, src: [49.3, 49.3], freeze: 49.3, crop: CROP.roster, stack: STACK }),
  mkScene({ id: 'h4', f0: T.b3, f1: T.b4, src: [4.42, 4.72], crop: formatRect(A, CROP.chatBlank), hard: true }),
  mkScene({ id: 'p1', f0: T.b4, f1: 136, src: [5.1, 7.5], crop: CROP.typing, stack: STACK }),
  mkScene({ id: 'p2a', f0: 136, f1: 153, src: [7.5, 8.05], crop: CROP.prompt, stack: STACK }),
  mkScene({ id: 'p2', f0: 153, f1: T.b11, src: [8.05, 8.05], freeze: 8.05, crop: CROP.prompt, stack: STACK }),
  mkScene({ id: 'c1', f0: T.b11, f1: 209, src: [10.6, 11.6], crop: r(380, 90, 1160, 600), stack: STACK }),
  mkScene({ id: 'c2', f0: 209, f1: 241, src: [11.6, 12.6], crop: r(395, 160, 980, 280), stack: STACK }),
  mkScene({ id: 'c3', f0: 241, f1: 273, src: [12.6, 13.6], crop: r(380, 0, 1200, 640), stack: STACK }),
  mkScene({ id: 'c4', f0: 273, f1: T.b19, src: [13.6, 14.6], crop: r(380, 0, 1200, 600), stack: STACK }),
  mkScene({ id: 's4a', f0: T.b19, f1: T.b21, src: [16.4, 18.5], crop: CROP.plan, stack: STACK }),
  mkScene({ id: 'pj1', f0: T.b21, f1: 402, src: [18.5, 20.66], crop: formatRect(A, 630), hard: true }),
  mkScene({ id: 'pj2', f0: 402, f1: 427, src: [20.66, 21.5], crop: CROP.plan, stack: STACK }),
  mkScene({ id: 'pj3', f0: 427, f1: 439, src: [21.5, 21.5], freeze: 21.5, crop: CROP.plan, stack: STACK }),
  mkScene({ id: 'pj4', f0: 439, f1: T.b29, src: [21.5, 22.8], crop: CROP.plan, stack: STACK }),
  mkScene({ id: 'cr1', f0: T.b29, f1: 562, src: [23.4, 26.5], crop: CROP.creators, cropTo: scaleRect(CROP.creators, 0.96), stack: STACK }),
  mkScene({ id: 'cr2', f0: 562, f1: T.b37, src: [26.5, 27.4], crop: r(395, 0, 607.5, 1080), hard: true }),
  mkScene({ id: 'k1', f0: T.b37, f1: 646, src: [38.3, 40.65], crop: CROP.cutTyping, stack: STACK }),
  mkScene({ id: 'k2', f0: 646, f1: 668, src: [41.4, 42.1], crop: CROP.bubble, stack: STACK }),
  mkScene({ id: 'k3a', f0: 668, f1: 677, src: [42.0, 42.3], crop: CROP.names, stack: STACK }),
  mkScene({ id: 'k3', f0: 677, f1: T.b44, src: [42.3, 42.3], freeze: 42.3, crop: CROP.names, stack: STACK }),
  mkScene({ id: 'e1', f0: T.b44, f1: T.b47, src: [43.4, 45.0], crop: r(400, 250, 1120, 520), cropTo: r(440, 300, 1040, 440), stack: STACK }),
  mkScene({ id: 'e2', f0: T.b47, f1: T.b50, src: [46.5, 49.2], crop: CROP.roster, stack: STACK }),
  mkScene({ id: 'e3', f0: T.b50, f1: T.b52, src: [49.3, 49.3], freeze: 49.3, crop: CROP.roster, cropTo: scaleRect(CROP.roster, 0.97), stack: STACK }),
  mkScene({ id: 'b1', f0: T.b52, f1: T.b54, src: [49.9, 50.9], crop: CROP.pills, stack: STACK }),
  mkScene({ id: 'b2', f0: T.b54, f1: T.b60, src: [51.3, 56.8], crop: CROP.brief, stack: STACK }),
  mkScene({ id: 'q1', f0: T.b60, f1: 1017, src: [66.4, 69.05], crop: CROP.quote, stack: STACK }),
  mkScene({ id: 'q2', f0: 1017, f1: T.b64, src: [69.05, 69.5], crop: r(1000, 0, 607.5, 1080), hard: true }),
  mkScene({ id: 'pay', f0: T.b64, f1: T.b68, src: [70.7, 73.4], crop: CROP.pay, stack: PAY }),
  mkScene({ id: 'dt', f0: T.b68, f1: T.b74, src: [110.9, 114.9], crop: CROP.dates, stack: STACK }),
  mkScene({ id: 'f1', f0: T.b74, f1: T.b77, src: [114.95, 116.25], crop: CROP.feed, stack: STACK }),
  mkScene({ id: 'f2', f0: T.b77, f1: T.b84, src: [116.9, 119.9], crop: CROP.board, stack: STACK }),
  mkScene({ id: 'tz', f0: T.b84, f1: T.b88, src: [119.8, 119.8], freeze: 119.8, crop: CROP.board, cropTo: scaleRect(CROP.board, 1.12), stack: STACK }),
  mkScene({ id: 'en', f0: T.b88, f1: T.b96, src: [119.8, 119.8], freeze: 119.8, crop: CROP.board, stack: STACK }),
];
