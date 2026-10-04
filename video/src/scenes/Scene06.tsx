import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, DraftPreview, FakeCursor, KineticText, POSTS, UserBubble, prog } from '../components';
import { CenterText, TopText, creator, dimAmt } from './shared';

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const riya = creator('riya');
  const jyoti = creator('jyoti');
  const ashish = creator('ashish');
  const scrollY = prog(f, 8, 26) * 122;
  const phase = f < 132 ? 0 : f < 158 ? 1 : 2;
  const mobile = prog(f, 60, 14);
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f, 38)} scrollY={scrollY} camera={{ scale: 0.96 + f * 0.0002, originY: 480 }}>
        <UserBubble text="Open Riya's and Jyoti's." enterAt={4} style={{ marginBottom: 20 }} />
        {phase === 0 && (
          <DraftPreview key="riya" post={POSTS.riya} name={riya.name} photo={riya.photo} enterAt={8} mobile={mobile}
            status={f >= 114 ? 'approved' : 'review'} statusAt={114} pressApproveAt={114} approvePulse={f > 96 && f < 114} />
        )}
        {phase === 1 && (
          <DraftPreview key="jyoti" post={POSTS.jyoti} name={jyoti.name} photo={jyoti.photo} enterAt={132}
            status={f >= 150 ? 'approved' : 'review'} statusAt={150} pressApproveAt={150} approvePulse={f > 138 && f < 150} />
        )}
        {phase === 2 && (
          <DraftPreview key="ashish" post={POSTS.ashish1} name={ashish.name} photo={ashish.photo} enterAt={158} approvePulse={f > 170} />
        )}
      </ChatShell>
      <CenterText>
        <KineticText size={112} wordGap={8} exitAt={36} lines={[{ text: 'Review like', start: 0 }, { text: 'a human.', start: 12 }]} />
      </CenterText>
      <TopText opacity={prog(f, 88, 4) * (1 - prog(f, 132, 10))}>
        <KineticText size={100} wordGap={7} lines={[{ text: "Approve what's right.", start: 90 }]} />
      </TopText>
      <FakeCursor
        keys={[
          { f: 16, x: 1500, y: 500 }, { f: 52, x: 1398, y: 166 }, { f: 84, x: 1400, y: 500 }, { f: 112, x: 1372, y: 772 },
          { f: 136, x: 1100, y: 700 }, { f: 148, x: 1372, y: 770 }, { f: 168, x: 1310, y: 800 }, { f: 174, x: 1372, y: 772 }, { f: 180, x: 1320, y: 790 },
        ]}
        clicks={[60, 114, 150]}
      />
    </AbsoluteFill>
  );
};
