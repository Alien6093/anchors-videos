import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, CleoWidget, FakeCursor, KineticText, SetupPanel, ToolLabel, lerp, pop, prog } from '../components';
import { CenterText, dimAmt } from './shared';

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const rise = pop(f, 6, 11, 120);
  const switched = f >= 128;
  const scrollY = prog(f, 80, 22) * 72;
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f, 38)} scrollY={scrollY} camera={{ scale: 1 + f * 0.0005, originY: 500 }}>
        <ToolLabel name="cleo_get_plan" start={0} doneAt={0} />
        <div style={{ marginTop: 22, opacity: Math.min(1, rise * 2), transform: `translateY(${lerp(260, 0, rise)}px)` }}>
          <CleoWidget activeTab={switched ? 'creators' : 'setup'} tabPressAt={126}>
            <div style={{ height: 372, opacity: switched ? 1 - prog(f, 128, 6) : 1 }}><SetupPanel start={30} stagger={8} /></div>
          </CleoWidget>
        </div>
        <ClaudeReply style={{ marginTop: 26 }} start={82} text="Plan ready. I matched 16 creators for HR audiences." />
      </ChatShell>
      <CenterText>
        <KineticText size={128} wordGap={8} exitAt={34} lines={[{ text: 'Campaign.', start: 0 }, { text: 'Built.', start: 9 }]} />
      </CenterText>
      <FakeCursor keys={[{ f: 70, x: 1420, y: 640 }, { f: 100, x: 1180, y: 380 }, { f: 124, x: 690, y: 298 }]} clicks={[126]} />
    </AbsoluteFill>
  );
};
