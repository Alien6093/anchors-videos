import React from 'react';
import { Format } from '../lib/format';
import { C, FONT_SANS } from '../components/theme';
import { pop } from '../lib/anim';
import { CHAPTERS } from './timeline';

const BAR_H = 8;
const TOTAL = 1543;
const BAR_Y = { '916': 258, '45': 1262 } as const;
const BAR_X = { '916': 60, '45': 80 } as const;

/** Orange progress bar on a 20% white track, linear over the whole film. */
export const Bar: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const x = BAR_X[format];
  const w = 1080 - x * 2;
  return (
    <div style={{ position: 'absolute', left: x, top: BAR_Y[format], width: w, height: BAR_H, borderRadius: BAR_H, background: 'rgba(255,255,255,.2)' }}>
      <div style={{ width: `${Math.min(1, frame / (TOTAL - 1)) * 100}%`, height: '100%', borderRadius: BAR_H, background: C.orange, boxShadow: `0 0 14px ${C.orange}` }} />
    </div>
  );
};

/** Chapter pill (9:16: under the bar; 4:5: label above the bar), swaps with a pop on the beat. */
export const ChapterPill: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const cur = [...CHAPTERS].reverse().find((c) => frame >= c.f);
  if (!cur || frame >= 1414) return null;
  const p = pop(frame, cur.f, 9, 240, 0.5);
  const is916 = format === '916';
  return (
    <div style={{ position: 'absolute', left: BAR_X[format], top: is916 ? BAR_Y[format] + 26 : BAR_Y[format] - 62, fontFamily: FONT_SANS }}>
      <div style={{ display: 'inline-block', transformOrigin: 'left center', transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 3), padding: is916 ? '8px 22px' : '6px 18px', borderRadius: 40, background: 'rgba(17,17,17,.72)', border: '2px solid rgba(255,255,255,.25)', color: '#fff', fontWeight: 800, fontSize: is916 ? 30 : 24, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        <span style={{ color: C.orange }}>{String(CHAPTERS.indexOf(cur) + 1).padStart(2, '0')}</span>{'  '}{cur.label}
      </div>
    </div>
  );
};
