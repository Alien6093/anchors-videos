export type Format = '916' | '45';

export const FPS = 30;
export const SRC_W = 1920;
export const SRC_H = 1080;

export type SafeArea = { top: number; bottom: number; side: number };

export type FormatSpec = {
  id: Format;
  width: number;
  height: number;
  safe: SafeArea;
  /** y (px from top) of the progress bar */
  progressTop: number;
  captionFont: number;
};

export const FORMATS: Record<Format, FormatSpec> = {
  '916': { id: '916', width: 1080, height: 1920, safe: { top: 250, bottom: 450, side: 60 }, progressTop: 214, captionFont: 124 },
  '45': { id: '45', width: 1080, height: 1350, safe: { top: 80, bottom: 80, side: 80 }, progressTop: 0, captionFont: 108 },
};

export const formatAspect = (f: Format): number => FORMATS[f].width / FORMATS[f].height;
