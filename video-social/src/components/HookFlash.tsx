import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FORMATS, Format } from '../lib/format';
import { lerp, pop, prog } from '../lib/anim';
import { C, FONT_SANS } from './theme';

const FLASH_FRAMES = 5;
const FADE_FRAMES = 8;

type Props = { text: string; format: Format; frame: number; durationFrames: number };

/** Scroll-stopper headline: slams in with overshoot, shakes, fades out. */
export const HookFlash: React.FC<Props> = ({ text, format, frame, durationFrames }) => {
  const spec = FORMATS[format];
  const p = pop(frame, 0, 8, 240, 0.55);
  const shake = Math.max(0, 1 - frame / 14);
  const dx = Math.sin(frame * 2.7) * 14 * shake;
  const dy = Math.cos(frame * 3.3) * 10 * shake;
  const fade = 1 - prog(frame, durationFrames - FADE_FRAMES, FADE_FRAMES);
  const flash = 1 - prog(frame, 0, FLASH_FRAMES);
  const words = text.trim().split(/\s+/);
  const size = words.length > 4 ? spec.captionFont * 0.9 : spec.captionFont * 1.15;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill style={{ background: 'rgba(0,0,0,.38)', opacity: prog(frame, 0, 4) }} />
      <AbsoluteFill style={{ background: '#fff', opacity: flash * 0.7 }} />
      <div style={{
        position: 'absolute', left: spec.safe.side, right: spec.safe.side, top: spec.safe.top, bottom: spec.safe.bottom,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONT_SANS,
        transform: `translate(${dx}px, ${dy}px) scale(${lerp(1.5, 1, p)}) rotate(${lerp(-4, 0, p)}deg)`,
      }}>
        <div style={{
          fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', textTransform: 'uppercase', color: '#fff',
          WebkitTextStroke: `${size * 0.08}px #111`, paintOrder: 'stroke fill', textShadow: `0 10px 0 ${C.red}, 0 18px 50px rgba(0,0,0,.7)`,
        }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
