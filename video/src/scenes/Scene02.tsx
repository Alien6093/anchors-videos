import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ChatShell, KineticText, ToolLabel, UserBubble, prog, typedCount } from '../components';
import { CenterText } from './shared';

const PROMPT = 'Build a LinkedIn campaign for zeko.ai targeting HR professionals, budget 1.5L';
const SEND = 81;

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const n = typedCount(PROMPT.length, f, 15, 44, [{ at: 40, frames: 12 }]);
  const sending = f < SEND;
  const scale = interpolate(f, [0, 135], [1.05, 1.1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <ChatShell
        inputText={sending ? PROMPT.slice(0, n) : ''} showCaret={sending && f >= 10}
        inputGlow={sending ? 0.7 : 0.1} sendPulse={prog(f, SEND - 3, 4) * (1 - prog(f, SEND + 2, 8))}
        camera={{ scale, originX: 960, originY: 760 }}
      >
        <UserBubble text={PROMPT} enterAt={SEND + 1} />
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <ToolLabel name="cleo_build_plan" start={105} doneAt={121} />
          <ToolLabel name="cleo_get_plan" start={123} />
        </div>
      </ChatShell>
      <CenterText y={60}>
        <KineticText size={96} wordGap={7} exitAt={72} lines={[{ text: 'Start with one sentence.', start: 3 }]} />
      </CenterText>
    </AbsoluteFill>
  );
};
