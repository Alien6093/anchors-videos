import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSerif } from '@remotion/google-fonts/SourceSerif4';
import { loadFont as loadInstrument } from '@remotion/google-fonts/InstrumentSerif';

const inter = loadInter('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });
const serif = loadSerif('normal', { weights: ['400', '600'], subsets: ['latin'] });
const instrument = loadInstrument('normal', { weights: ['400'], subsets: ['latin'] });
const instrumentItalic = loadInstrument('italic', { weights: ['400'], subsets: ['latin'] });

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
