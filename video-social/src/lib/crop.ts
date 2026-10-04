import { SRC_H, SRC_W } from './format';
import { easeInOut, lerp } from './anim';
import { Rect } from './plan';

export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/** Crop rect at a scene-local frame (eased interpolation when cropTo is set). */
export const cropAt = (crop: Rect, cropTo: Rect | undefined, frame: number, frames: number): Rect => {
  if (!cropTo) return crop;
  const t = frames <= 1 ? 1 : Math.min(1, Math.max(0, frame / (frames - 1)));
  return lerpRect(crop, cropTo, easeInOut(t));
};

export type BoxTransform = { readonly scale: number; readonly tx: number; readonly ty: number };

/** Transform (origin 0 0) that makes `rect` of the 1920x1080 source cover a box. */
export const coverTransform = (rect: Rect, boxW: number, boxH: number): BoxTransform => {
  const scale = Math.max(boxW / rect.w, boxH / rect.h);
  return { scale, tx: boxW / 2 - (rect.x + rect.w / 2) * scale, ty: boxH / 2 - (rect.y + rect.h / 2) * scale };
};

/** Full-height source window of a given aspect centred (clamped) on a crop's centre. */
export const windowAround = (crop: Rect, aspect: number): Rect => {
  const w = Math.min(SRC_W, SRC_H * aspect);
  const h = w / aspect;
  const cx = Math.min(SRC_W - w / 2, Math.max(w / 2, crop.x + crop.w / 2));
  return { x: cx - w / 2, y: (SRC_H - h) / 2, w, h };
};

/** Full-crop rect matching a format's aspect: `zoom` 1 = full source height, centred on (cx, cy) in source px. Clamped inside the source. */
export const formatRect = (aspect: number, cx: number, zoom = 1, cy = SRC_H / 2): Rect => {
  const h = SRC_H / zoom;
  const w = Math.min(SRC_W, h * aspect);
  const hh = w / aspect;
  return { x: Math.min(SRC_W - w, Math.max(0, cx - w / 2)), y: Math.min(SRC_H - hh, Math.max(0, cy - hh / 2)), w, h: hh };
};
