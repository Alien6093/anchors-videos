import { Format } from '../lib/format';
import { Rect, Scene } from '../lib/plan';
import { TOTAL_FRAMES, T } from './tokens';

type Seg = {
  readonly id: string;
  readonly from: number;
  readonly to: number;
  /** source frame shown at `from` */
  readonly src: number;
  readonly crop: Rect;
  readonly cropTo?: Rect;
  readonly layout?: 'stack-blur' | 'full-crop';
  readonly freeze?: boolean;
};

const R = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });

const toScene = (s: Seg): Scene => ({
  id: s.id,
  source: 'B',
  srcInSec: s.src / 30,
  srcOutSec: (s.src + (s.to - s.from)) / 30,
  freezeAtSec: s.freeze ? s.src / 30 : undefined,
  crop: s.crop,
  cropTo: s.cropTo,
  layout: s.layout ?? 'stack-blur',
});

const assertContiguous = (segs: readonly Seg[]): readonly Seg[] => {
  segs.reduce((at, s) => {
    if (s.from !== at || s.to <= s.from) throw new Error(`stage3 segment "${s.id}" starts at ${s.from}, expected ${at}`);
    return s.to;
  }, 0);
  const end = segs[segs.length - 1].to;
  if (end !== TOTAL_FRAMES) throw new Error(`stage3 segments end at ${end}, expected ${TOTAL_FRAMES}`);
  return segs;
};

/** Per-scene layout metadata consumed by the renderer (keyed by scene id prefix). */
export type SceneMeta = { readonly caption: 'top' | 'bottom' | 'none'; readonly cy?: number };

const HOOK_CROP = R(90, 230, 1740, 740);
const HOOK_PUSH = R(100, 240, 1680, 712);
const COUNTER_WIDE = R(280, 300, 1400, 520);
const COUNTER_TIGHT = R(300, 410, 1360, 360);
const TILES_ROW = R(290, 380, 1340, 500);
const PLAN_CARD = R(250, 190, 1420, 810);

const segments916 = (): readonly Seg[] => [
  { id: 'hook-freeze', from: 0, to: 4, src: 45, crop: HOOK_CROP, freeze: true },
  { id: 'hook-race', from: 4, to: 48, src: 4, crop: HOOK_CROP, cropTo: HOOK_PUSH },
  { id: 'hook-black', from: 48, to: 64, src: 48, crop: HOOK_PUSH },
  // S2 board: hard crop, pan to the bubble at b6
  { id: 's2-board', from: 64, to: 96, src: 193, crop: R(365, 110, 545, 970), layout: 'full-crop' },
  { id: 's2-bubble', from: 96, to: 129, src: 225, crop: R(985, 110, 545, 970), layout: 'full-crop' },
  // S3 counter + tiles
  { id: 's3-wide', from: 129, to: 161, src: 257, crop: COUNTER_WIDE },
  { id: 's3-tight', from: 161, to: 177, src: 289, crop: COUNTER_TIGHT },
  { id: 's3-lock', from: 177, to: 182, src: 305, crop: COUNTER_TIGHT, freeze: true },
  { id: 's3-morph', from: 182, to: 193, src: 306, crop: COUNTER_TIGHT },
  { id: 's3-imp', from: 193, to: 209, src: 317, crop: R(250, 385, 600, 190) },
  { id: 's3-likes', from: 209, to: 225, src: 333, crop: R(740, 385, 520, 190) },
  { id: 's3-comm', from: 225, to: 241, src: 349, crop: R(1150, 385, 520, 190) },
  { id: 's3-row', from: 241, to: 257, src: 365, crop: TILES_ROW },
  // S4 time jump (native card covers)
  { id: 's4-jump', from: 257, to: 321, src: 579, crop: R(240, 330, 1440, 300) },
  // S5 crest
  { id: 's5-ask', from: 321, to: 354, src: 643, crop: R(400, 170, 1160, 260) },
  { id: 's5-count', from: 354, to: 417, src: 676, crop: R(280, 340, 1380, 440) },
  { id: 's5-lock', from: 417, to: 423, src: 739, crop: R(280, 340, 1380, 440), freeze: true },
  { id: 's5-glow', from: 423, to: 430, src: 740, crop: R(280, 340, 1380, 440) },
  { id: 's5-pull', from: 430, to: 450, src: 752, crop: R(280, 340, 1380, 440) },
  { id: 's5-tiles1', from: 450, to: 482, src: 772, crop: R(300, 380, 1320, 160) },
  { id: 's5-tiles2', from: 482, to: 514, src: 804, crop: R(290, 380, 1340, 400) },
  { id: 's5-cpm', from: 514, to: 579, src: 836, crop: R(600, 110, 545, 970), layout: 'full-crop' },
  // S6 table (no freeze, no zoom)
  { id: 's6-table', from: 579, to: 707, src: 900, crop: R(140, 250, 1640, 700) },
  // S7 plan card
  { id: 's7-card', from: 707, to: 771, src: 1029, crop: R(100, 125, 1720, 955) },
  { id: 's7-marker', from: 771, to: 836, src: 1093, crop: R(240, 170, 1440, 910), cropTo: R(350, 170, 1220, 770) },
  // S8 Ashish
  { id: 's8-sentence', from: 836, to: 900, src: 1157, crop: R(380, 120, 1180, 330) },
  { id: 's8-table', from: 900, to: 948, src: 1221, crop: R(380, 380, 1160, 470) },
  { id: 's8-chip', from: 948, to: 964, src: 1269, crop: R(380, 380, 1160, 520) },
  // S9 comments
  { id: 's9-wide', from: 964, to: 1012, src: 1286, crop: R(380, 150, 1160, 620) },
  { id: 's9-card1', from: 1012, to: 1077, src: 1334, crop: R(385, 345, 1150, 410) },
  { id: 's9-card2', from: 1077, to: 1157, src: 1399, crop: R(400, 440, 1130, 330) },
  // S10 audience
  { id: 's10-roles', from: 1157, to: 1334, src: 1479, crop: R(100, 110, 545, 970), layout: 'full-crop' },
  { id: 's10-wide', from: 1334, to: 1350, src: 1656, crop: R(60, 290, 1800, 620) },
  // S11 end card (native)
  { id: 's11-end', from: 1350, to: 1479, src: 1671, crop: R(440, 580, 1040, 500) },
];

const segments45 = (): readonly Seg[] => [
  { id: 'hook-freeze', from: 0, to: 4, src: 45, crop: HOOK_CROP, freeze: true },
  { id: 'hook-race', from: 4, to: 48, src: 4, crop: HOOK_CROP, cropTo: HOOK_PUSH },
  { id: 'hook-black', from: 48, to: 64, src: 48, crop: HOOK_PUSH },
  { id: 's2-board', from: 64, to: 96, src: 193, crop: R(380, 110, 776, 970), layout: 'full-crop' },
  { id: 's2-bubble', from: 96, to: 129, src: 225, crop: R(780, 110, 776, 970), layout: 'full-crop' },
  { id: 's3-wide', from: 129, to: 177, src: 257, crop: COUNTER_WIDE },
  { id: 's3-lock', from: 177, to: 182, src: 305, crop: COUNTER_WIDE, freeze: true },
  { id: 's3-morph', from: 182, to: 193, src: 306, crop: COUNTER_WIDE },
  { id: 's3-tiles', from: 193, to: 257, src: 317, crop: R(300, 395, 1320, 260), cropTo: R(330, 400, 1260, 250) },
  { id: 's4-jump', from: 257, to: 321, src: 579, crop: R(240, 330, 1440, 300) },
  { id: 's5-ask', from: 321, to: 354, src: 643, crop: R(400, 170, 1160, 260) },
  { id: 's5-count', from: 354, to: 417, src: 676, crop: R(280, 340, 1380, 440) },
  { id: 's5-lock', from: 417, to: 423, src: 739, crop: R(280, 340, 1380, 440), freeze: true },
  { id: 's5-glow', from: 423, to: 430, src: 740, crop: R(280, 340, 1380, 440) },
  { id: 's5-pull', from: 430, to: 450, src: 752, crop: R(280, 340, 1380, 440) },
  { id: 's5-tiles', from: 450, to: 514, src: 772, crop: R(290, 380, 1340, 400) },
  { id: 's5-cpm', from: 514, to: 579, src: 836, crop: R(590, 500, 1050, 290) },
  { id: 's6-table', from: 579, to: 707, src: 900, crop: R(140, 250, 1640, 700) },
  { id: 's7-card', from: 707, to: 836, src: 1029, crop: R(100, 125, 1720, 955), cropTo: R(350, 170, 1220, 770) },
  { id: 's8-post', from: 836, to: 964, src: 1157, crop: R(380, 130, 1180, 640), cropTo: R(380, 300, 1180, 640) },
  { id: 's9-comments', from: 964, to: 1157, src: 1286, crop: R(380, 150, 1160, 620), cropTo: R(392, 250, 1136, 600) },
  { id: 's10-roles', from: 1157, to: 1334, src: 1479, crop: R(70, 110, 776, 970), layout: 'full-crop' },
  { id: 's10-wide', from: 1334, to: 1350, src: 1656, crop: R(60, 290, 1800, 620) },
  { id: 's11-end', from: 1350, to: 1479, src: 1671, crop: R(440, 580, 1040, 500) },
];

export const buildScenes = (format: Format): readonly Scene[] =>
  assertContiguous(format === '916' ? segments916() : segments45()).map(toScene);

/** Scene ids in order with their global start frames (for renderer lookups). */
export const SCENE_STARTS = T;

/** Caption anchor per scene id (captions themselves live in captions.ts). */
const metaFor = (id: string): SceneMeta => {
  if (id.startsWith('s2-') || id.startsWith('s10-') || id === 's5-cpm') return { caption: 'bottom' };
  if (id.startsWith('hook') || id.startsWith('s4-') || id.startsWith('s11')) return { caption: 'none' };
  return { caption: 'top' };
};
export const sceneMeta = (id: string, format: Format): SceneMeta => {
  const m = metaFor(id);
  if (format === '45') return { ...m, caption: m.caption === 'none' ? 'none' : 'top' };
  if (id.startsWith('hook') && !id.endsWith('black')) return { caption: 'none', cy: 930 };
  return m;
};
