import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, KineticText, prog } from '../components';
import { CenterText } from './shared';

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const chatIn = prog(f, 18, 45);
  const glow = 0.45 + 0.4 * Math.sin(f / 6);
  const hit = Math.max(0, 1 - f / 14);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: chatIn }}>
        <ChatShell dim={0.62} inputGlow={glow * chatIn} camera={{ scale: 1 + f * 0.0006, originY: 540 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(232,116,59,${0.35 * hit}), transparent 55%)` }} />
      <CenterText>
        <KineticText
          size={118} wordGap={9} exitAt={95} pulseAt={82}
          lines={[{ text: 'Structured interviews', start: 0 }, { text: 'still hide gut decisions.', start: 42, accent: ['gut'] }]}
        />
      </CenterText>
    </AbsoluteFill>
  );
};
