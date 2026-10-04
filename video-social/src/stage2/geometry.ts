import { FORMATS, Format } from '../lib/format';
import { Rect } from '../lib/plan';
import { Box, SceneSpec } from './spec';

const BAND_916 = { top: 290, bottom: 1210 } as const;
const BAND_45_TOP = 290;
const BAND_45_SPAN = 900;
const CARD_45_TOP_BIAS = 0.3;

export const cardHeight = (w: number, crop: Rect): number => Math.round((w * crop.h) / crop.w);

/** Where the main picture sits in the output frame. */
export const mainBox = (spec: SceneSpec, format: Format): Box => {
  const f = FORMATS[format];
  const v = spec.view;
  if (v.kind === 'hard' || v.kind === 'blur') return { left: 0, top: 0, w: f.width, h: f.height };
  const h = cardHeight(v.w, spec.crop);
  const explicitTop = v.top;
  const autoTop = format === '916'
    ? BAND_916.top + (BAND_916.bottom - BAND_916.top - h) / 2
    : BAND_45_TOP + Math.max(0, (BAND_45_SPAN - h) * CARD_45_TOP_BIAS);
  return { left: (f.width - v.w) / 2, top: Math.round(explicitTop ?? autoTop), w: v.w, h };
};

export const extraBox = (spec: SceneSpec): Box | undefined =>
  spec.extra ? { left: spec.extra.left, top: spec.extra.top, w: spec.extra.w, h: cardHeight(spec.extra.w, spec.extra.crop) } : undefined;
