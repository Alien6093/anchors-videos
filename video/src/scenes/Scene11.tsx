import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { AudienceChips, ChatShell, CreatorMetricsTable, KineticText, MetricsTable, SentimentBar, ToolLabel, UserBubble, easeInOut, prog } from '../components';
import { TopText } from './shared';

export const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const scrollY = interpolate(f, [0, 62, 92, 112, 150], [0, 0, 310, 310, 750], {
    extrapolateRight: 'clamp', easing: easeInOut,
  });
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scrollY} camera={{ scale: 0.98 + f * 0.00015, originY: 480 }}>
        <div style={{ height: 76 }} />
        <UserBubble text="How is it performing?" enterAt={2} />
        <ToolLabel name="cleo_campaign_performance" start={5} doneAt={13} style={{ marginTop: 20 }} />
        <div style={{ marginTop: 22 }}><MetricsTable start={15} dur={45} /></div>
        <div style={{ marginTop: 26 }}><CreatorMetricsTable start={76} stagger={4.5} /></div>
        <div style={{ marginTop: 30 }}><SentimentBar start={112} /></div>
        <div style={{ marginTop: 28 }}><AudienceChips start={142} /></div>
      </ChatShell>
      <TopText opacity={prog(f, 14, 4) * (1 - prog(f, 108, 10))}>
        <KineticText size={112} wordGap={8} lines={[{ text: '2.8L reached.', start: 16, accent: ['2.8L'] }]} />
      </TopText>
      <TopText opacity={prog(f, 134, 4)}>
        <KineticText size={100} wordGap={8} lines={[{ text: 'Real HR audiences.', start: 136 }]} />
      </TopText>
    </AbsoluteFill>
  );
};
