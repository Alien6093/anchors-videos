import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, KineticText, UserBubble, prog, easeInOut, typedCount } from '../components';
import { Caption, Rise } from '../components/a/kit';
import { WidgetA } from '../components/a/WidgetA';
import { CreatorsBoard } from '../components/a/CreatorsBoard';
import { NameChips } from '../components/a/NameChips';

const SENT = 'Cut to the 8 closest fits and cap the budget at Rs 1,50,000.';
const TYPE_AT = 24; // 38.3s
const ENTER = 90; // 40.5s

export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const n = typedCount(SENT.length, f, TYPE_AT, 30);
  const typing = f < ENTER;
  const dim = 1 - prog(f, 20, 14);
  const scroll = prog(f, ENTER + 2, 26, easeInOut) * 790;
  return (
    <AbsoluteFill>
      <ChatShell dim={dim} scrollY={scroll} inputText={typing ? SENT.slice(0, n) : ''} showCaret={typing && f >= TYPE_AT - 4} inputGlow={typing && f > TYPE_AT ? 0.7 : 0.1}
        sendPulse={prog(f, ENTER - 3, 4) * (1 - prog(f, ENTER + 2, 8))}>
        <div style={{ opacity: 0.55 }}>
          <WidgetA activeTab="creators"><CreatorsBoard sortP={1} enterAt={-99} /></WidgetA>
        </div>
        <UserBubble text={SENT} enterAt={ENTER + 1} style={{ marginTop: 36, display: f < ENTER ? 'none' : 'flex' }} />
        <Rise at={ENTER + 12} style={{ marginTop: 26 }}>
          <ClaudeReply text="I need names to remove anyone. These are the 8 creators furthest from HR hiring topics:" start={ENTER + 12} wordGap={1.6} size={34} />
        </Rise>
        <NameChips at={ENTER + 28} />
        <Rise at={ENTER + 38}><ClaudeReply text="Remove them and cap the budget at Rs 1,50,000?" start={ENTER + 38} wordGap={1.6} size={34} /></Rise>
      </ChatShell>
      {f < 30 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <KineticText size={120} wordGap={4} exitAt={20} lines={[{ text: 'Keep the closest fits.', start: 2 }]} />
        </AbsoluteFill>
      )}
      <Caption text="Keep the closest fits." at={28} />
    </AbsoluteFill>
  );
};
