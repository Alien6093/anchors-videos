import { Rect } from '../lib/plan';
import { Format } from '../lib/format';

export type Tone = 'cream' | 'orange' | 'green';

/** On-screen type block. accent = index of the single orange word (-1 none). */
export type Cap = { readonly f0: number; readonly f1: number; readonly text: string; readonly accent: number; readonly size?: number };
export type Sticker = { readonly f0: number; readonly f1: number; readonly text: string; readonly tone: Tone };
/** Ring around a source-pixel rect, mapped through the named scene's crop. */
export type Ring = { readonly rel?: boolean; readonly f0: number; readonly f1: number; readonly scene: string; readonly rect: Rect; readonly tone: Tone };
export type Chapter = { readonly f: number; readonly label: string };

export const CHAPTERS: readonly Chapter[] = [
  { f: 64, label: 'Chat' },
  { f: 305, label: 'Plan' },
  { f: 466, label: 'Creators' },
  { f: 1029, label: 'Live' },
];

/** 9:16 slabs for the three payoff flashes (one word each, on the beat). */
export const HOOK_SLABS: readonly Cap[] = [
  { f0: 0, f1: 16, text: 'LIVE.', accent: 0 },
  { f0: 16, f1: 32, text: 'PAID.', accent: 0 },
  { f0: 32, f1: 48, text: '16 to 8.', accent: 2 },
];

const CAPS_916: readonly Cap[] = [
  { f0: 48, f1: 92, text: 'One chat. Whole campaign.', accent: 3, size: 108 },
  { f0: 94, f1: 177, text: 'Start with a website.', accent: 3 },
  { f0: 181, f1: 305, text: 'Three choices. Yours.', accent: 3 },
  { f0: 307, f1: 337, text: 'The plan builds itself.', accent: 3 },
  { f0: 339, f1: 466, text: 'Know the reach first.', accent: 3 },
  { f0: 468, f1: 595, text: 'Sort them your way.', accent: 0 },
  { f0: 597, f1: 707, text: 'Keep the closest fits.', accent: 2 },
  { f0: 757, f1: 836, text: 'Cost and forecast follow.', accent: 2 },
  { f0: 838, f1: 868, text: 'Briefs for all 8.', accent: 3 },
  { f0: 870, f1: 964, text: 'The brief writes itself.', accent: 3 },
  { f0: 966, f1: 1029, text: 'Every rupee, itemised.', accent: 2 },
  { f0: 1031, f1: 1093, text: 'Pay once.', accent: 0 },
  { f0: 1095, f1: 1189, text: 'Set once. Final.', accent: 2 },
  { f0: 1191, f1: 1237, text: 'Live on LinkedIn.', accent: 3 },
  { f0: 1239, f1: 1350, text: 'Three days. Eight posts.', accent: 3 },
  { f0: 1354, f1: 1414, text: 'Next: drafts. Approvals. Results.', accent: -1, size: 78 },
];

const CAPS_45: readonly Cap[] = [
  { f0: 0, f1: 35, text: 'A full creator campaign. One chat.', accent: 5, size: 68 },
  { f0: 48, f1: 96, text: 'One chat. Whole campaign.', accent: 3, size: 84 },
  { f0: 96, f1: 177, text: 'Start with a website.', accent: 3 },
  { f0: 177, f1: 305, text: 'Three choices. Yours.', accent: 3 },
  { f0: 305, f1: 337, text: 'The plan builds itself.', accent: 3 },
  { f0: 337, f1: 466, text: 'Know the reach first.', accent: 3 },
  { f0: 466, f1: 595, text: 'Sort them your way.', accent: 0 },
  { f0: 595, f1: 755, text: 'Keep the closest fits.', accent: 2 },
  { f0: 755, f1: 836, text: 'Cost and forecast follow.', accent: 2 },
  { f0: 836, f1: 868, text: 'Briefs for all 8.', accent: 3 },
  { f0: 868, f1: 964, text: 'The brief writes itself.', accent: 3 },
  { f0: 964, f1: 1029, text: 'Every rupee, itemised.', accent: 2 },
  { f0: 1029, f1: 1093, text: 'Pay once.', accent: 0 },
  { f0: 1093, f1: 1189, text: 'Set once. Final.', accent: 2 },
  { f0: 1189, f1: 1237, text: 'Live on LinkedIn.', accent: 3 },
  { f0: 1237, f1: 1350, text: 'Three days. Eight posts.', accent: 3 },
  { f0: 1350, f1: 1414, text: 'Next: drafts. Approvals. Results.', accent: -1, size: 60 },
];

export const captionsFor = (f: Format): readonly Cap[] => (f === '916' ? CAPS_916 : CAPS_45);

/** Numeric callouts: only numbers that appear in script_v4.md. */
export const STICKERS: readonly Sticker[] = [
  { f0: 349, f1: 420, text: '5.42-5.58 lakh', tone: 'orange' },
  { f0: 420, f1: 466, text: 'Rs 540 CPM', tone: 'cream' },
  { f0: 555, f1: 595, text: 'Sort: Engagement', tone: 'cream' },
  { f0: 651, f1: 707, text: '8 closest fits. Rs 1,50,000.', tone: 'cream' },
  { f0: 757, f1: 804, text: 'Rs 3,00,000 → Rs 1,50,000', tone: 'orange' },
  { f0: 804, f1: 836, text: '2.69-2.77 lakh', tone: 'orange' },
  { f0: 838, f1: 868, text: '8 creators', tone: 'cream' },
  { f0: 1017, f1: 1029, text: 'Rs 1,47,000', tone: 'orange' },
  { f0: 1120, f1: 1189, text: 'Wed 7 · Thu 8 · Fri 9', tone: 'cream' },
  { f0: 1290, f1: 1350, text: '8 creators', tone: 'cream' },
];

export const RINGS: readonly Ring[] = [
  { rel: true, f0: 2, f1: 16, scene: 'h1', rect: { x: 405, y: 195, w: 190, h: 70 }, tone: 'green' },
  { rel: true, f0: 1, f1: 16, scene: 'h2', rect: { x: 590, y: 650, w: 745, h: 115 }, tone: 'orange' },
  { rel: true, f0: 2, f1: 16, scene: 'h3', rect: { x: 1125, y: 660, w: 110, h: 75 }, tone: 'orange' },
  { f0: 142, f1: 177, scene: 'p2', rect: { x: 1325, y: 80, w: 200, h: 40 }, tone: 'orange' },
  { f0: 152, f1: 177, scene: 'p2', rect: { x: 745, y: 128, w: 200, h: 38 }, tone: 'orange' },
  { f0: 409, f1: 466, scene: 'pj3', rect: { x: 375, y: 300, w: 520, h: 190 }, tone: 'orange' },
  { f0: 425, f1: 466, scene: 'pj3', rect: { x: 380, y: 690, w: 200, h: 70 }, tone: 'cream' },
  { f0: 570, f1: 595, scene: 'cr2', rect: { x: 770, y: 455, w: 210, h: 80 }, tone: 'orange' },
  { f0: 574, f1: 595, scene: 'cr2', rect: { x: 770, y: 790, w: 215, h: 80 }, tone: 'orange' },
  { f0: 648, f1: 668, scene: 'k2', rect: { x: 885, y: 178, w: 235, h: 38 }, tone: 'orange' },
  { f0: 652, f1: 668, scene: 'k2', rect: { x: 675, y: 222, w: 235, h: 38 }, tone: 'orange' },
  { f0: 840, f1: 868, scene: 'b1', rect: { x: 400, y: 270, w: 680, h: 120 }, tone: 'orange' },
  { f0: 1017, f1: 1029, scene: 'q2', rect: { x: 1165, y: 405, w: 325, h: 72 }, tone: 'orange' },
  { f0: 1150, f1: 1189, scene: 'dt', rect: { x: 1240, y: 760, w: 290, h: 60 }, tone: 'orange' },
  { f0: 1262, f1: 1350, scene: 'f2', rect: { x: 1135, y: 190, w: 385, h: 85 }, tone: 'cream' },
];
