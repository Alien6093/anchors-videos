// Visual constants. Colours are measured from the real Anchors UI in the
// recordings (see DESIGN.md for sample locations).
export const W = 1920;
export const H = 1080;
export const FPS = 30;

// Source recordings
export const SRC_W = 1914;
export const SRC_H = 866;
// The bottom 2 rows of every recording carry a magenta capture artefact
// (#FF92E5 / #C32C7F); we never show them.
export const SRC_H_CLEAN = 862;

export const C = {
  red: '#DB2425', // primary buttons (Continue, Check Latest Outline, View Matched Influencers)
  redLight: '#EE4243', // "Go to Dashboard" success button
  redLogo: '#D72228', // logo dots
  ink: '#111111',
  inkSoft: 'rgba(17,17,17,0.88)',
  white: '#FFFFFF',
  base: '#0C0C0E',
};

export const FONT = "'Inter', system-ui, sans-serif";

// Camera
export const MAX_ZOOM = 2.4; // never magnify source pixels beyond this
// Area the focus rect is fitted into (leaves room for chip / callout / progress)
export const VIEW = {left: 48, right: W - 48, top: 40, bottom: 936};

// Transition lengths in frames
export const TRANS_FRAMES: Record<string, number> = {
  cut: 0,
  whoosh: 8,
  zoom: 10,
  fade: 10,
};
