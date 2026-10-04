import React from 'react';
import { Format } from '../lib/format';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { sceneMeta } from './scenes';
import { ACCENT, T, W } from './tokens';

type Cap = { readonly id: string; readonly text: string; readonly from: number; readonly to: number };

/** `*word*` marks the accent word. One entry per scene; text is identical for both formats. */
const CAPS: readonly Cap[] = [
  { id: 's2-board', text: 'All 8 posts *live.*', from: 68, to: 129 },
  { id: 's3-wide', text: 'Day three. *Still climbing.*', from: 133, to: 255 },
  { id: 's5-ask', text: 'The *final count.*', from: 325, to: 449 },
  { id: 's5-tiles1', text: 'Rs 525 CPM. *Plan: Rs 540.*', from: 454, to: 514 },
  { id: 's5-cpm', text: 'Rs 525 CPM. *Plan: Rs 540.*', from: 514, to: 577 },
  { id: 's6-table', text: 'Ranks moved. *Biggest reach first.*', from: 583, to: 705 },
  { id: 's7-card', text: 'Beat the plan. *Reach and cost.*', from: 711, to: 834 },
  { id: 's8-sentence', text: 'Zoom in on *one post.*', from: 840, to: 962 },
  { id: 's9-wide', text: 'Praise and pushback. *Both shown.*', from: 968, to: 1155 },
  { id: 's10-roles', text: 'Right people. *Right roles.*', from: 1161, to: 1276 },
];

const OUT_FRAMES = 6;
const SIZE: Record<Format, number> = { '916': 100, '45': 62 };

type Token = { readonly text: string; readonly accent: boolean };
const tokenize = (text: string): readonly Token[] =>
  text.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((part) => {
    const accent = part.startsWith('*');
    return part.replace(/\*/g, '').trim().split(/\s+/).map((t) => ({ text: t, accent }));
  });

const textShadow = '0 6px 16px rgba(0,0,0,.55), 0 2px 3px rgba(0,0,0,.5)';

const Caption916: React.FC<{ cap: Cap; frame: number; bottom: boolean }> = ({ cap, frame, bottom }) => {
  const words = tokenize(cap.text);
  const size = words.length >= 5 ? 86 : SIZE['916'];
  const local = frame - cap.from;
  const fade = 1 - prog(frame, cap.to - OUT_FRAMES, OUT_FRAMES);
  const pos: React.CSSProperties = bottom ? { bottom: 1920 - 1415 } : { top: 290 };
  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, ...pos, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      gap: `0 ${size * 0.2}px`, fontFamily: FONT_SANS, opacity: fade, transform: `translateY(${(1 - fade) * 14}px)`,
    }}>
      {words.map((w, i) => {
        const p = pop(local, i * 2, 9, 230, 0.55);
        return (
          <span key={`${w.text}-${i}`} style={{
            display: 'inline-block', fontSize: size, fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.035em',
            color: w.accent ? ACCENT : '#fff', textShadow, opacity: Math.min(1, p * 4),
            transform: `scale(${lerp(0.55, 1, Math.min(p, 1.15))}) translateY(${(1 - Math.min(p, 1)) * 24}px)`,
          }}>{w.text}</span>
        );
      })}
    </div>
  );
};

const Caption45: React.FC<{ cap: Cap; frame: number }> = ({ cap, frame }) => {
  const words = tokenize(cap.text);
  const t = prog(frame, cap.from, 12, easeOut);
  const fade = 1 - prog(frame, cap.to - OUT_FRAMES, OUT_FRAMES);
  return (
    <div style={{
      position: 'absolute', left: 80, right: 80, top: 80, fontFamily: FONT_SANS, fontSize: SIZE['45'], fontWeight: 800, lineHeight: 1.08,
      letterSpacing: '-0.03em', textAlign: 'left', color: '#fff', textShadow, opacity: t * fade, transform: `translateY(${(1 - t) * 18}px)`,
    }}>
      {words.map((w, i) => (
        <span key={`${w.text}-${i}`} style={{ color: w.accent ? ACCENT : '#fff' }}>{w.text}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </div>
  );
};

/** Active scene caption for a global frame. */
export const Captions: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const cap = CAPS.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  if (format === '45') return <Caption45 cap={cap} frame={frame} />;
  return <Caption916 cap={cap} frame={frame} bottom={sceneMeta(cap.id, format).caption === 'bottom'} />;
};

export const CAPTION_WIDTH_HINT = W;
export const CAPTION_FRAMES = T;
