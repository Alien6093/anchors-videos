import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { lerp, pop, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { CaptionSpec } from './captionTable';
import { CAPTION_BOTTOM_45_TOP, CAPTION_BOTTOM_916, ORANGE, OUT_FRAMES } from './tokens';

const WORD_STAGGER = 3;
const SIZE_916 = 100;
const SIZE_45 = 60;
const SHADOW = '0 6px 28px rgba(0,0,0,.65), 0 2px 0 rgba(0,0,0,.5)';

/** Word-by-word pop (3f stagger, ~8% overshoot), 4f upward fade out. */
export const Kinetic916: React.FC<{ text: string; accent: number; frames: number; size?: number; bottom?: number }> = ({ text, accent, frames, size = SIZE_916, bottom = 1920 - CAPTION_BOTTOM_916 }) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  const out = prog(f, frames - OUT_FRAMES, OUT_FRAMES);
  return (
    <div style={{
      position: 'absolute', left: 60, width: 900, bottom, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      gap: `0 ${size * 0.24}px`, fontFamily: FONT_SANS, opacity: 1 - out, transform: `translateY(${lerp(0, -28, out)}px)`,
    }}>
      {words.map((w, i) => {
        const p = pop(f, i * WORD_STAGGER, 11, 260, 0.55);
        return (
          <span key={`${w}-${i}`} style={{
            display: 'inline-block', fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', color: i === accent ? ORANGE : '#fff',
            textShadow: SHADOW, opacity: Math.min(1, p * 3), transform: `translateY(${lerp(40, 0, Math.min(1, p))}px) scale(${lerp(0.7, 1, p)})`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/** LinkedIn headline: sentence case, top-left, calm fade-up per word. */
export const Headline45: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  const out = prog(f, frames - OUT_FRAMES, OUT_FRAMES);
  return (
    <div style={{
      position: 'absolute', left: 80, top: CAPTION_BOTTOM_45_TOP, width: 920, display: 'flex', flexWrap: 'wrap', gap: `0 ${SIZE_45 * 0.26}px`,
      fontFamily: FONT_SANS, opacity: 1 - out, transform: `translateY(${lerp(0, -14, out)}px)`,
    }}>
      {words.map((w, i) => {
        const p = prog(f, i * 1.5, 9);
        return (
          <span key={`${w}-${i}`} style={{
            fontSize: SIZE_45, fontWeight: 800, lineHeight: 1.14, letterSpacing: '-0.02em', color: '#fff', textShadow: SHADOW,
            opacity: p, transform: `translateY(${lerp(16, 0, p)}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

export const CaptionView: React.FC<{ format: Format; cap: CaptionSpec }> = ({ format, cap }) => {
  const frames = cap.b - cap.a;
  return format === '916' ? <Kinetic916 text={cap.text} accent={cap.accent} frames={frames} /> : <Headline45 text={cap.text} frames={frames} />;
};
