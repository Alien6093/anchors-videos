import React from 'react';
import { Format } from '../lib/format';
import { C, FONT_SANS } from '../components/theme';
import { pop, prog } from '../lib/anim';
import { Tone } from './timeline';

export const TONE_BG: Record<Tone, { bg: string; fg: string }> = {
  cream: { bg: C.cream, fg: C.ink },
  orange: { bg: C.orange, fg: '#ffffff' },
  green: { bg: C.green, fg: '#ffffff' },
};
const RING_COLOR: Record<Tone, string> = { cream: C.cream, orange: C.orange, green: C.green };

type RingProps = { x: number; y: number; w: number; h: number; tone: Tone; /** frames since ring start */ t: number };

/** Pulsing rounded outline that pops in over 3 frames with a little overshoot. */
export const RingMark: React.FC<RingProps> = ({ x, y, w, h, tone, t }) => {
  const p = pop(t, 0, 9, 260, 0.5);
  const pulse = 1 + 0.03 * Math.sin(t / 3);
  const pad = 10;
  const color = RING_COLOR[tone];
  return (
    <div style={{
      position: 'absolute', left: x - pad, top: y - pad, width: w + pad * 2, height: h + pad * 2, borderRadius: Math.min(36, (h + pad * 2) / 2),
      border: `6px solid ${color}`, boxShadow: `0 0 0 3px rgba(17,17,17,.55), 0 0 26px ${color}`, opacity: Math.min(1, p * 2.5),
      transform: `scale(${(0.7 + 0.3 * p) * pulse})`,
    }} />
  );
};

type StickerProps = { text: string; tone: Tone; format: Format; t: number; dur: number };

/** Number sticker sitting in the lane below the card (inside the safe zone). */
export const StickerMark: React.FC<StickerProps> = ({ text, tone, format, t, dur }) => {
  const p = pop(t, 0, 10, 220, 0.55);
  const out = 1 - prog(t, dur - 4, 4);
  const is916 = format === '916';
  const { bg, fg } = TONE_BG[tone];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: is916 ? 1385 : 1108, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 3) * out }}>
      <div style={{
        transform: `translateY(-50%) scale(${0.75 + 0.25 * p}) rotate(${(1 - p) * -4}deg)`, background: bg, color: fg, fontFamily: FONT_SANS, fontWeight: 800,
        fontSize: is916 ? 50 : 36, letterSpacing: '-0.02em', padding: is916 ? '16px 36px' : '12px 26px', borderRadius: is916 ? 28 : 22,
        border: '4px solid #111', boxShadow: '0 8px 0 #111, 0 18px 36px rgba(0,0,0,.4)', whiteSpace: 'nowrap',
        maxWidth: is916 ? 960 : 920,
      }}>{text}</div>
    </div>
  );
};
