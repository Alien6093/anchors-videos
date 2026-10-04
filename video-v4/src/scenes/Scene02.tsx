import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ChatShell, UserBubble, prog, typedCount } from '../components';
import { Caption, ToolLine } from '../components/a/kit';

const PROMPT = 'Build a LinkedIn creator campaign for https://zeko.ai. Budget Rs 3 lakh.';
const ENTER = 93; // 7.6s
const TYPE_AT = 15;

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const n = typedCount(PROMPT.length, f, TYPE_AT, 35, [{ at: PROMPT.indexOf('zeko.ai') + 8, frames: 10 }]);
  const typing = f < ENTER;
  const scale = interpolate(f, [0, 120], [1, 1.08], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <ChatShell
        inputText={typing ? PROMPT.slice(0, n) : ''} showCaret={typing || f % 30 < 18}
        inputGlow={typing ? 0.8 : 0.15} sendPulse={prog(f, ENTER - 3, 4) * (1 - prog(f, ENTER + 2, 8))}
        camera={{ scale, originX: 960, originY: 760 }}
      >
        <UserBubble text={PROMPT} enterAt={ENTER + 1} style={{ display: f < ENTER ? 'none' : 'flex' }} />
        <div style={{ marginTop: 26 }}>
          <ToolLine label="Used anchors integration, loaded tools" start={105} doneAt={116} />
        </div>
      </ChatShell>
      <Caption text="Start with a website." at={6} />
    </AbsoluteFill>
  );
};
