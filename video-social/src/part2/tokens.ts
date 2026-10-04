export const FPS = 30;
export const TOTAL = 1440;

/** Scene boundaries (global frames), every one on a 15-frame beat. */
export const SC = {
  hook: [0, 60], brief: [60, 120], board: [120, 180], review: [180, 300], same: [300, 360],
  approve: [360, 450], sent1: [450, 600], sent2: [600, 780], revised: [780, 840],
  count: [840, 960], gold: [960, 1050], dates: [1050, 1170], live: [1170, 1320], end: [1320, 1440],
} as const;

export type Creator = { key: string; first: string; full: string; photo: string };

export const CREATORS: Record<string, Creator> = {
  ashish: { key: 'ashish', first: 'Ashish', full: 'Ashish Shukla', photo: 'photos/ashish-shukla.webp' },
  riya: { key: 'riya', first: 'Riya', full: 'Riya Dadhich', photo: 'photos/riya-dadhich.webp' },
  gunjan: { key: 'gunjan', first: 'Gunjan', full: 'Gunjan Mishra', photo: 'photos/gunjan-mishra.webp' },
  priyanshu: { key: 'priyanshu', first: 'Priyanshu', full: 'Priyanshu Manas', photo: 'photos/priyanshu-manas.webp' },
  jyoti: { key: 'jyoti', first: 'Jyoti', full: 'Jyoti Vyas', photo: 'photos/jyoti-vyas.webp' },
  sunidhi: { key: 'sunidhi', first: 'Sunidhi', full: 'Sunidhi', photo: 'photos/sunidhi.webp' },
  shubhangi: { key: 'shubhangi', first: 'Shubhangi', full: 'Shubhangi Shrivastava', photo: 'photos/shubhangi-shrivastava.webp' },
  darika: { key: 'darika', first: 'Darika', full: 'Darika Jain', photo: 'photos/darika-jain.webp' },
};

export const ORDER_BRIEF = ['ashish', 'riya', 'gunjan', 'priyanshu', 'jyoti', 'sunidhi', 'shubhangi', 'darika'];
export const ORDER_LIVE = ['ashish', 'riya', 'gunjan', 'shubhangi', 'jyoti', 'sunidhi', 'priyanshu', 'darika'];
export const FLIP_ORDER = ['sunidhi', 'riya', 'jyoti', 'gunjan', 'shubhangi', 'darika', 'priyanshu', 'ashish'];

export const DARIKA_TEXT =
  "We are excited to announce Zeko AI, a revolutionary new platform and the world's number one choice for enterprise workforce intelligence.";
export const PRIYANSHU_TEXT =
  "Zeko AI removes gut decisions from hiring completely and guarantees the perfect hire every time. No more mistakes, no more regrets. Founders, this is the only tool you'll ever need for talent decisions.";

export const CHECKS = ['Zeko AI in line 1', '#ZekoAI', 'People & Culture angle', 'No absolute claims', 'No press-release tone'];

export const CHIP_DATES: readonly { from: number; to: number; text: string }[] = [
  { from: 150, to: 180, text: 'Sat 3 Oct' },
  { from: 180, to: 780, text: 'Mon 5 Oct' },
  { from: 780, to: 1170, text: 'Tue 6 Oct' },
  { from: 1170, to: 1200, text: 'Wed 7 Oct' },
  { from: 1200, to: 1320, text: 'Thu 8 Oct' },
];
