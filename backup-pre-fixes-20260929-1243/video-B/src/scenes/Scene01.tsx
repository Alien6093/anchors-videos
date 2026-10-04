import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, KineticText, prog } from '../components';
import { Teaser } from '../components/a/Teaser';

const SMASH = 48; // 1.6s
const TITLE_AT = 57; // 1.9s
const CHAT_AT = 96; // 3.2s
const TITLE_OUT = 121; // slides out ~4.3s

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const chatP = prog(f, CHAT_AT, 20);
  const caret = f % 30 < 18;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {f < SMASH && <Teaser />}
      {f >= TITLE_AT - 4 && (
        <AbsoluteFill style={{ opacity: chatP }}>
          <ChatShell inputGlow={0.8} showCaret={caret} dim={0.75 * (1 - prog(f, TITLE_OUT, 12))} />
        </AbsoluteFill>
      )}
      {f >= TITLE_AT && f < 140 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
          <div style={{ transform: `scale(${1 + 0.05 * (1 - prog(f, TITLE_AT, 8))})` }}>
            <KineticText
              size={170} wordGap={3} exitAt={TITLE_OUT}
              lines={[{ text: 'One Chat.', start: TITLE_AT }, { text: 'Whole Campaign.', start: TITLE_AT + 6, accent: ['Campaign'] }]}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
