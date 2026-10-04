export type Creator = { key: string; name: string; photo: string };

export const CREATORS: Record<string, Creator> = {
  ashish: { key: 'ashish', name: 'Ashish Shukla', photo: 'photos/ashish-shukla.webp' },
  riya: { key: 'riya', name: 'Riya Dadhich', photo: 'photos/riya-dadhich.webp' },
  gunjan: { key: 'gunjan', name: 'Gunjan Mishra', photo: 'photos/gunjan-mishra.webp' },
  shubhangi: { key: 'shubhangi', name: 'Shubhangi Shrivastava', photo: 'photos/shubhangi-shrivastava.webp' },
  jyoti: { key: 'jyoti', name: 'Jyoti Vyas', photo: 'photos/jyoti-vyas.webp' },
  sunidhi: { key: 'sunidhi', name: 'Sunidhi', photo: 'photos/sunidhi.webp' },
  priyanshu: { key: 'priyanshu', name: 'Priyanshu Manas', photo: 'photos/priyanshu-manas.webp' },
  darika: { key: 'darika', name: 'Darika Jain', photo: 'photos/darika-jain.webp' },
};

/** Board order (B kit ORDER_LIVE). First four are live at Part 2's last frame. */
export const BOARD_ORDER = ['ashish', 'riya', 'gunjan', 'shubhangi', 'jyoti', 'sunidhi', 'priyanshu', 'darika'] as const;

export type Cap = { a: number; b: number; lines: string[] };

/** 9:16 captions (<= 5 words). *word* = orange accent. Beat frames (15 f/beat). */
export const CAPS_916: Cap[] = [
  { a: 0, b: 30, lines: ['Ask your', '*campaign.*'] },
  { a: 30, b: 60, lines: ['It answers', 'in *numbers.*'] },
  { a: 60, b: 180, lines: ['Day three.', 'Still *climbing.*'] },
  { a: 450, b: 510, lines: ['Likes. Comments.', '*Engagement.*'] },
  { a: 510, b: 600, lines: ['Now against', 'the *plan.*'] },
  { a: 600, b: 690, lines: ['Ahead on reach', 'and *cost.*'] },
  { a: 690, b: 810, lines: ['One post,', 'up *close.*'] },
  { a: 810, b: 990, lines: ['Praise and', '*pushback.*'] },
  { a: 990, b: 1170, lines: ['Top role:', '*HR* and Talent.'] },
  { a: 1170, b: 1200, lines: ['*Built.*'] },
  { a: 1200, b: 1230, lines: ['*Reviewed.*'] },
  { a: 1230, b: 1260, lines: ['*Monitored.*'] },
  { a: 1260, b: 1320, lines: ['In one', '*Claude* chat.'] },
];

/** 4:5 headlines (<= 8 words), one per scene, hand-broken. */
export const CAPS_45: Cap[] = [
  { a: 0, b: 60, lines: ['Ask your live campaign', "how it's *doing.*"] },
  { a: 60, b: 180, lines: ['Day three:', 'still *climbing.*'] },
  { a: 390, b: 510, lines: ['Two weeks in: likes,', 'comments, *engagement.*'] },
  { a: 510, b: 690, lines: ['Ahead of plan on', 'reach and *cost.*'] },
  { a: 690, b: 810, lines: ["One creator's post,", 'up *close.*'] },
  { a: 810, b: 990, lines: ['Comments read in full:', 'praise and *pushback.*'] },
  { a: 990, b: 1170, lines: ['HR and Talent Acquisition', 'are the *top role.*'] },
  { a: 1170, b: 1200, lines: ['*Built.*'] },
  { a: 1200, b: 1230, lines: ['Built, *reviewed.*'] },
  { a: 1230, b: 1260, lines: ['Built, reviewed,', '*monitored.*'] },
  { a: 1260, b: 1320, lines: ['Built, reviewed, monitored:', 'all in one *Claude chat.*'] },
];
