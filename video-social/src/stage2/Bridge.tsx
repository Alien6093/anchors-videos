import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { lerp, pop, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { F } from './spec';
import { ORANGE } from './tokens';

const EXIT_START = 1340;
const EXIT_FRAMES = 12;

/** "Next: set live dates." over the blurred last frame (Stage 3 tease + loop bridge). */
export const Bridge: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  if (f < F.bridge || f >= F.endCard) return null;
  const t = f - F.bridge;
  const out = prog(f, EXIT_START, EXIT_FRAMES);
  const is916 = format === '916';
  const size = is916 ? 118 : 84;
  const p1 = pop(t, 2, 12, 200, 0.6);
  const p2 = pop(t, 8, 12, 200, 0.6);
  const line: React.CSSProperties = { fontSize: size, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0, textShadow: '0 8px 40px rgba(0,0,0,.6)' };
  return (
    <AbsoluteFill style={{ fontFamily: FONT_SANS, opacity: 1 - out, filter: `blur(${lerp(0, 14, out)}px)` }}>
      <AbsoluteFill style={{ background: 'rgba(10,8,6,.42)', opacity: prog(t, 0, 8) }} />
      <div style={{ position: 'absolute', left: 60, width: 960, top: is916 ? 760 : 470, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: is916 ? 10 : 6 }}>
        <div style={{ ...line, color: ORANGE, opacity: Math.min(1, p1 * 3), transform: `translateY(${lerp(50, 0, Math.min(1, p1))}px) scale(${lerp(0.8, 1, p1)})` }}>Next:</div>
        <div style={{ ...line, color: '#fff', opacity: Math.min(1, p2 * 3), transform: `translateY(${lerp(50, 0, Math.min(1, p2))}px) scale(${lerp(0.8, 1, p2)})` }}>set live dates.</div>
      </div>
    </AbsoluteFill>
  );
};
