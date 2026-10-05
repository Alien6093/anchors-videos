import { continueRender, delayRender } from 'remotion';
import { FONT_FACES } from './fontData';

// Fonts: the exact Google Fonts files (Inter, Source Serif 4, Instrument Serif; latin subset) embedded as data URIs
// by tools/fetch-fonts.mjs, so rendering needs no network (fonts.gstatic.com is unreachable behind some proxies).
// Same families/weights as the previous @remotion/google-fonts loaders.
if (typeof document !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Loading embedded fonts', { timeoutInMilliseconds: 60000 });
  let done = false;
  const finish = () => { if (!done) { done = true; continueRender(handle); } };
  Promise.all(
    FONT_FACES.map((m) => new FontFace(m.family, `url(${m.src}) format('woff2')`, { style: m.style, weight: m.weight, unicodeRange: m.unicodeRange })
      .load().then((f) => document.fonts.add(f))),
  ).then(finish, (e) => { console.error(e); finish(); });
  // Data-URI fonts decode in milliseconds; never let a stalled tab hang the render (fonts are re-checked below).
  setTimeout(finish, 8000);
}
const inter = { fontFamily: 'Inter' };
const serif = { fontFamily: '"Source Serif Four"' };
const instrument = { fontFamily: '"Instrument Serif"' };
const instrumentItalic = instrument;

export const FONT_SANS = `${inter.fontFamily}, system-ui, sans-serif`;
export const FONT_SERIF = `${serif.fontFamily}, Georgia, serif`;
export const FONT_DISPLAY = `${instrument.fontFamily}, ${instrumentItalic.fontFamily}, Georgia, serif`;

export const C = {
  bg: '#1f1e1d',
  panel: '#262624',
  bubble: '#30302e',
  border: '#3d3c39',
  text: '#ececec',
  muted: '#9b9993',
  cream: '#FBF7F1',
  creamHead: '#F8ECE5',
  creamLine: '#E9E1D6',
  ink: '#1c1917',
  inkSoft: '#6b655d',
  red: '#D63A2F',
  orange: '#E8743B',
  green: '#3FB27F',
  greenDeep: '#1E8A5A',
  amber: '#F0A24A',
  blue: '#6AA8FF',
  violet: '#B69CFF',
  li: '#0A66C2',
} as const;

// 112 BPM
export const BEAT = 30 * 60 / 112; // 16.07 frames
export const COLUMN_X = 410;
export const COLUMN_W = 1100;
