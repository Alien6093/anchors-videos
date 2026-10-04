export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 60 * FPS; // 1800

export const sec = (s: number) => Math.round(s * FPS);

// Scene windows from script_v1.md (seconds)
export const SCENES = [
  { id: 1, name: 'Myth', start: 0, end: 3.5 },
  { id: 2, name: 'Prompt', start: 3.5, end: 8 },
  { id: 3, name: 'Plan', start: 8, end: 13 },
  { id: 4, name: 'Creators', start: 13, end: 18 },
  { id: 5, name: 'Drafts', start: 18, end: 23 },
  { id: 6, name: 'Review', start: 23, end: 29 },
  { id: 7, name: 'Nudge', start: 29, end: 34 },
  { id: 8, name: 'Approved', start: 34, end: 39 },
  { id: 9, name: 'SetLive', start: 39, end: 44 },
  { id: 10, name: 'Live', start: 44, end: 49 },
  { id: 11, name: 'Metrics', start: 49, end: 56 },
  { id: 12, name: 'EndCard', start: 56, end: 60 },
] as const;
