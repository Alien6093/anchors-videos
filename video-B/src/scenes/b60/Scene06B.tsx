import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT_SANS, KineticText } from '../../components';
import { lerp, prog } from '../../components/anim';
import { Whip } from '../../components/bm/Whip';
import { S5_T, SnapChat } from '../../components/bm/SnapChat';

const S6_T = S5_T + 65;
const GHOST_OPACITY = 0.08;
const DATE_AT = 32;
const WORD_GAP = 11; // frames between words (was 7: scaled-in words touched)

export const Scene06B: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(1, 1.04, prog(f, 0, 64, (t) => t));
  return (
    <Whip total={64} inFrames={7} outFrames={7} dist={500}>
      <AbsoluteFill style={{ opacity: lerp(1, GHOST_OPACITY, prog(f, 0, 10)) }}>
        <Sequence from={-S6_T} layout="none"><SnapChat extraDim={0.9 * prog(f, 0, 10)} /></Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36, transform: `scale(${push})` }}>
        <KineticText size={170} wordGap={WORD_GAP} lines={[{ text: 'Two weeks later.', start: 2 }]} />
        <div style={{ opacity: prog(f, DATE_AT, 8), transform: `translateY(${lerp(30, 0, prog(f, DATE_AT, 12))}px)`, fontFamily: FONT_SANS, fontSize: 44, fontWeight: 700, color: C.ink, background: C.cream, padding: '14px 34px', borderRadius: 18 }}>Fri 23 Oct 2026</div>
      </AbsoluteFill>
    </Whip>
  );
};
