import { RankMetrics, RankRowData } from '../components/bm/RankTable';

type Seed = { key: string; name: string; post: string; snap: RankMetrics; fin: RankMetrics };

// Snapshot: Fri 9 Oct 2026, 8:00 PM (script section 6). Final: fixed v4 section 7.
const SEEDS: Seed[] = [
  { key: 'shubhangi', name: 'Shubhangi Shrivastava', post: 'Thu 9:30 AM', snap: { imp: 43100, likes: 634, comments: 45, eng: 1.58 }, fin: { imp: 61500, likes: 905, comments: 64, eng: 1.58 } },
  { key: 'ashish', name: 'Ashish Shukla', post: 'Wed 10:00 AM', snap: { imp: 38100, likes: 619, comments: 54, eng: 1.77 }, fin: { imp: 44800, likes: 728, comments: 63, eng: 1.77 } },
  { key: 'gunjan', name: 'Gunjan Mishra', post: 'Wed 5:00 PM', snap: { imp: 29100, likes: 435, comments: 32, eng: 1.6 }, fin: { imp: 34200, likes: 512, comments: 38, eng: 1.61 } },
  { key: 'darika', name: 'Darika Jain', post: 'Fri 1:00 PM', snap: { imp: 27600, likes: 434, comments: 29, eng: 1.68 }, fin: { imp: 68900, likes: 1085, comments: 72, eng: 1.68 } },
  { key: 'sunidhi', name: 'Sunidhi', post: 'Thu 5:00 PM', snap: { imp: 18500, likes: 281, comments: 19, eng: 1.62 }, fin: { imp: 26400, likes: 401, comments: 27, eng: 1.62 } },
  { key: 'riya', name: 'Riya Dadhich', post: 'Wed 1:00 PM', snap: { imp: 15100, likes: 223, comments: 18, eng: 1.6 }, fin: { imp: 17800, likes: 262, comments: 21, eng: 1.59 } },
  { key: 'jyoti', name: 'Jyoti Vyas', post: 'Thu 12:00 PM', snap: { imp: 8500, likes: 202, comments: 25, eng: 2.67 }, fin: { imp: 12100, likes: 289, comments: 35, eng: 2.68 } },
  { key: 'priyanshu', name: 'Priyanshu Manas', post: 'Fri 10:00 AM', snap: { imp: 5700, likes: 127, comments: 16, eng: 2.51 }, fin: { imp: 14300, likes: 318, comments: 41, eng: 2.51 } },
];

const rankBy = (key: string, pick: 'snap' | 'fin') => {
  const sorted = [...SEEDS].sort((a, b) => b[pick].imp - a[pick].imp);
  return sorted.findIndex((s) => s.key === key);
};

export const RANK_ROWS: RankRowData[] = SEEDS.map((s) => ({ ...s, snapRank: rankBy(s.key, 'snap'), finRank: rankBy(s.key, 'fin') }));

export const SNAP_TOTALS: RankMetrics = { imp: 185700, likes: 2955, comments: 238, eng: 1.72 };
export const FINAL_TOTALS: RankMetrics = { imp: 280000, likes: 4500, comments: 361, eng: 1.74 };
export const FORECAST_LOW = 269000;
export const FORECAST_HIGH = 277000;
