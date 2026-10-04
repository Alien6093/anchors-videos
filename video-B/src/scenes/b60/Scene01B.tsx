import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, KineticText } from '../../components';
import { easeInOut, prog } from '../../components/anim';
import { TeaserB } from '../../components/bm/TeaserB';

const SMASH = 48; // 1.607s hard cut to black
const TITLE_AT = 64; // 2.143s, on the bar line
const CHAT_AT = 96; // 3.214s
const TITLE_OUT = 124; // 4.14s

export const Scene01B: React.FC = () => {
  const f = useCurrentFrame();
  const chatP = prog(f, CHAT_AT, 20);
  const caret = f % 30 < 18;
  const exit = prog(f, TITLE_OUT, 5, easeInOut);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {f < SMASH && <TeaserB />}
      {f >= TITLE_AT && (
        <AbsoluteFill style={{ opacity: chatP }}>
          <ChatShell inputGlow={0.8} showCaret={caret} dim={0.75 * (1 - prog(f, TITLE_OUT, 5))} />
        </AbsoluteFill>
      )}
      {f >= TITLE_AT && f < 129 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30, transform: `translateY(${-exit * 160}px)`, opacity: 1 - exit }}>
          <div style={{ transform: `scale(${1 + 0.05 * (1 - prog(f, TITLE_AT, 8))})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <KineticText size={190} wordGap={4} lines={[{ text: 'Every Number.', start: TITLE_AT }, { text: 'One Chat.', start: TITLE_AT + 6 }]} />
            <div style={{ marginTop: 26, fontFamily: FONT_SANS, fontSize: 42, fontWeight: 600, color: C.muted, letterSpacing: '0.01em', opacity: prog(f, TITLE_AT + 16, 10) }}>Zeko AI x anchors</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
