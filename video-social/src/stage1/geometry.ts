import { FORMATS, Format } from '../lib/format';
import { cropAt } from '../lib/crop';
import { PlacedScene, Rect, sceneFrames } from '../lib/plan';

const DEFAULT_CARD_MARGIN = 40;

/** Maps a source-pixel rect to frame pixels for a placed scene at an absolute frame (mirrors CroppedClip). */
export const srcRectToFrame = (placed: PlacedScene, format: Format, rect: Rect, frame: number): Rect => {
  const spec = FORMATS[format];
  const { scene } = placed;
  const crop = cropAt(scene.crop, scene.cropTo, Math.max(0, frame - placed.from), sceneFrames(scene));
  if (scene.layout === 'full-crop') {
    const k = Math.max(spec.width / crop.w, spec.height / crop.h);
    const tx = spec.width / 2 - (crop.x + crop.w / 2) * k;
    const ty = spec.height / 2 - (crop.y + crop.h / 2) * k;
    return { x: rect.x * k + tx, y: rect.y * k + ty, w: rect.w * k, h: rect.h * k };
  }
  const cardW = scene.stack?.cardWidth ?? spec.width - DEFAULT_CARD_MARGIN * 2;
  const maxH = spec.height - spec.safe.top - spec.safe.bottom;
  const cardH = Math.min(cardW / (crop.w / crop.h), maxH);
  const fitW = Math.min(cardW, cardH * (crop.w / crop.h));
  const top = scene.stack?.cardTop ?? spec.safe.top + (maxH - cardH) / 2;
  const left = (spec.width - fitW) / 2;
  const k = Math.max(fitW / crop.w, cardH / crop.h);
  const tx = left + fitW / 2 - (crop.x + crop.w / 2) * k;
  const ty = top + cardH / 2 - (crop.y + crop.h / 2) * k;
  return { x: rect.x * k + tx, y: rect.y * k + ty, w: rect.w * k, h: rect.h * k };
};
