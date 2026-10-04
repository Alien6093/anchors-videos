import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { lerp, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { HOOK_TEXT } from './captionTable';
import { CAPTION_BOTTOM_45_TOP, CAPTION_BOTTOM_916, ORANGE, OUT_FRAMES } from './tokens';

export const HOOK_FRAMES = 64;
export const STAMP_FRAME = 32;
const WORD_STEP = 2;
const HOOK_SIZE_916 = 112;
const HOOK_SIZE_45 = 54;

/** Kinetic question: words slam in on frames 0-6 (2f each), frame 0 already at 30%. */
const HookText: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  const { text, accent } = HOOK_TEXT[format];
  const words = text.split(/\s+/);
  const is916 = format === '916';
  const size = is916 ? HOOK_SIZE_916 : HOOK_SIZE_45;
  const out = prog(f, HOOK_FRAMES - OUT_FRAMES, OUT_FRAMES);
  const pos: React.CSSProperties = is916
    ? { left: 60, width: 900, bottom: 1920 - CAPTION_BOTTOM_916, justifyContent: 'center' }
    : { left: 80, width: 920, top: CAPTION_BOTTOM_45_TOP + 6, justifyContent: 'flex-start' };
  return (
    <div style={{ position: 'absolute', ...pos, display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.24}px`, fontFamily: FONT_SANS, opacity: 1 - out, transform: `translateY(${lerp(0, -20, out)}px)` }}>
      {words.map((w, i) => {
        const p = prog(f, i * WORD_STEP, 3);
        const base = i === 0 ? lerp(0.3, 1, p) : p;
        return (
          <span key={`${w}-${i}`} style={{
            fontSize: size, fontWeight: is916 ? 900 : 800, lineHeight: 1.04, letterSpacing: '-0.035em', color: i === accent ? ORANGE : '#fff',
            textShadow: '0 6px 30px rgba(0,0,0,.7)', opacity: base,
            transform: is916 ? `scale(${lerp(1.7, 1, p)}) rotate(${lerp(-5, 0, p)}deg)` : `translateY(${lerp(10, 0, p)}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

export const HookOverlay: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  const thud = 1 - prog(f, STAMP_FRAME, 3);
  return (
    <AbsoluteFill>
      <HookText format={format} />
      {f >= STAMP_FRAME && <AbsoluteFill style={{ background: '#fff', opacity: thud * 0.16 }} />}
    </AbsoluteFill>
  );
};
