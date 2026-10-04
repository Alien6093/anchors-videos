import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { AnchorsLogo } from '../AnchorsLogo';
import { lerp, pop, prog } from '../anim';

/** Plain dark end card, local frames: logo hit +6, CTA button pulse, fade to black at the last frames. */
export const EndCardB: React.FC = () => {
  const f = useCurrentFrame();
  const line = (at: number) => ({ opacity: prog(f, at, 14), transform: `translateY(${lerp(24, 0, prog(f, at, 14))}px)` });
  const cta = pop(f, 60, 14, 140);
  const pulse = f > 80 ? 0.5 + 0.5 * Math.sin((f - 80) / 5) : 0;
  const drift = 1 + 0.02 * prog(f, 0, 129, (t) => t);
  const fade = prog(f, 117, 12, (t) => t);
  return (
    <AbsoluteFill style={{ background: C.bg, alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS }}>
      <div style={{ position: 'absolute', width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,58,47,.20), transparent 60%)', opacity: prog(f, 0, 30) }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})` }}>
        <AnchorsLogo size={150} frame={f} delay={6} />
        <div style={{ ...line(36), marginTop: 44, fontSize: 60, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Run your creator campaign in a chat.</div>
        <div style={{
          marginTop: 56, background: C.orange, color: '#fff', fontSize: 40, fontWeight: 700, padding: '24px 54px', borderRadius: 20,
          opacity: Math.min(1, cta * 2), transform: `scale(${lerp(0.85, 1, cta) + 0.02 * pulse})`, boxShadow: `0 0 ${20 + 50 * pulse}px rgba(232,116,59,${0.3 + 0.3 * pulse})`,
        }}>Ask Claude: How is it performing? → anchors.in</div>
        <div style={{ ...line(78), marginTop: 44, fontSize: 30, color: C.muted }}>Zeko AI, live on LinkedIn.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#000', opacity: fade }} />
    </AbsoluteFill>
  );
};
