import React from 'react';
import { FORMATS, Format } from '../lib/format';
import { Arrow, Callout as CalloutSpec, CalloutTone } from '../lib/plan';
import { lerp, pop, prog } from '../lib/anim';
import { C, FONT_SANS } from './theme';

const OUT_FRAMES = 6;
const W_EST = 520; // rough sticker width used for safe-zone clamping
const H_EST = 130;

const TONES: Record<CalloutTone, { bg: string; fg: string }> = {
  cream: { bg: C.cream, fg: C.ink },
  green: { bg: C.green, fg: '#fff' },
  orange: { bg: C.orange, fg: '#fff' },
};

const ARROW_ROT: Record<Exclude<Arrow, 'none'>, number> = { up: 180, down: 0, left: 90, right: -90 };

const ArrowIcon: React.FC<{ dir: Exclude<Arrow, 'none'>; color: string }> = ({ dir, color }) => (
  <svg width={64} height={64} viewBox="0 0 64 64" style={{ display: 'block', transform: `rotate(${ARROW_ROT[dir]}deg)`, filter: 'drop-shadow(0 4px 0 #111)' }}>
    <path d="M32 6 L32 46 M14 30 L32 50 L50 30" fill="none" stroke="#111" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 6 L32 46 M14 30 L32 50 L50 30" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Props = { callout: CalloutSpec; format: Format; frame: number; durationFrames: number };

/** Sticker-style label with optional arrow; centre is clamped inside the safe area. */
export const Callout: React.FC<Props> = ({ callout, format, frame, durationFrames }) => {
  const spec = FORMATS[format];
  const tone = TONES[callout.tone ?? 'cream'];
  const arrow = callout.arrow ?? 'none';
  const p = pop(frame, 0, 10, 200, 0.6);
  const fade = 1 - prog(frame, durationFrames - OUT_FRAMES, OUT_FRAMES);
  const bob = Math.sin(frame / 6) * 6;
  const cx = Math.min(spec.width - spec.safe.side - W_EST / 2, Math.max(spec.safe.side + W_EST / 2, callout.x * spec.width));
  const cy = Math.min(spec.height - spec.safe.bottom - H_EST, Math.max(spec.safe.top + H_EST / 2, callout.y * spec.height));
  const vertical = arrow === 'up' || arrow === 'down';
  return (
    <div style={{
      position: 'absolute', left: cx, top: cy, transform: `translate(-50%, -50%) scale(${lerp(0.3, 1, p)}) rotate(${lerp(-10, -3, p)}deg)`,
      opacity: Math.min(1, p * 3) * fade, display: 'flex', flexDirection: vertical ? (arrow === 'up' ? 'column-reverse' : 'column') : (arrow === 'left' ? 'row-reverse' : 'row'),
      alignItems: 'center', gap: 6, fontFamily: FONT_SANS,
    }}>
      <div style={{
        background: tone.bg, color: tone.fg, fontSize: 50, fontWeight: 900, letterSpacing: '-0.02em', padding: '16px 34px', borderRadius: 26,
        border: '5px solid #111', boxShadow: '0 10px 0 #111, 0 18px 40px rgba(0,0,0,.45)', maxWidth: W_EST, textAlign: 'center', lineHeight: 1.05,
      }}>{callout.text}</div>
      {arrow !== 'none' && <div style={{ transform: `translateY(${bob}px)` }}><ArrowIcon dir={arrow} color={tone.bg} /></div>}
    </div>
  );
};
