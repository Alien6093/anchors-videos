import React from 'react';
import { FORMATS, Format } from '../lib/format';
import { Caption, CaptionPosition, CaptionStyle } from '../lib/plan';
import { lerp, pop, prog } from '../lib/anim';
import { C, FONT_SANS } from './theme';

const WORD_STAGGER = 3;
const OUT_FRAMES = 6;

const STYLE_COLOR: Record<CaptionStyle, string> = { pop: '#ffffff', accent: C.orange, number: C.green };

export const captionTop = (format: Format, position: CaptionPosition): number => {
  const s = FORMATS[format];
  if (position === 'upper') return s.safe.top + 30;
  if (position === 'middle') return s.height * 0.42;
  return s.height - s.safe.bottom - 330;
};

type Props = { caption: Caption; format: Format; /** frame relative to caption start */ frame: number; durationFrames: number };

/** Big bold 2-4 word caption; each word springs in with overshoot. */
export const KineticCaption: React.FC<Props> = ({ caption, format, frame, durationFrames }) => {
  const spec = FORMATS[format];
  const style = caption.style ?? 'pop';
  const words = caption.text.trim().split(/\s+/);
  const fade = 1 - prog(frame, durationFrames - OUT_FRAMES, OUT_FRAMES);
  const size = style === 'number' ? spec.captionFont * 1.35 : spec.captionFont;
  return (
    <div style={{
      position: 'absolute', left: spec.safe.side, right: spec.safe.side, top: captionTop(format, caption.position ?? 'lower'),
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.22}px`, opacity: fade,
      transform: `translateY(${lerp(0, 18, 1 - fade)}px)`, fontFamily: FONT_SANS,
    }}>
      {words.map((w, i) => {
        const p = pop(frame, i * WORD_STAGGER, 9, 210, 0.6);
        return (
          <span key={`${w}-${i}`} style={{
            display: 'inline-block', fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: i === words.length - 1 && style === 'pop' && words.length > 1 ? C.amber : STYLE_COLOR[style],
            WebkitTextStroke: `${size * 0.09}px #111`, paintOrder: 'stroke fill',
            textShadow: '0 8px 0 #111, 0 14px 36px rgba(0,0,0,.65)',
            opacity: Math.min(1, p * 3), transform: `scale(${lerp(0.4, 1, p)}) rotate(${lerp(-6, 0, p)}deg)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};
