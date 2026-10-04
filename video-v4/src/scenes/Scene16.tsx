import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ToolLabel, UserBubble } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftWidget } from '../components/b/DraftWidget';
import { Caption, DateChip, Scrim, Turn } from '../components/b/bits';
import { CHECKS, B_POSTS } from '../components/b/posts';
import { cre } from '../components/b/kit';
import { easeInOut, lerp, prog } from '../components/anim';

export const Scene16: React.FC = () => {
  const f = useCurrentFrame();
  const riya = cre('riya');
  const zoom = 1 + 0.08 * prog(f, 0, 180, (t) => t);
  const items = CHECKS.map((label, i) => ({ label, at: 45 + i * 11.25 }));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn><UserBubble text="Open Riya's draft." enterAt={0} /></Turn>
        <Turn><ToolLabel name="CLEO - Open a draft preview" start={6} doneAt={20} /></Turn>
      </ChatShell>
      <Scrim at={4} a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 55%' }}>
        <DraftWidget post={B_POSTS.riya} name={riya.name} photo={riya.photo} width={1000} enterAt={8}
          mobile={prog(f, 120, 18, easeInOut)} style={{ position: 'absolute', left: 60, top: 150 }} />
        <ChecksPanel items={items} enterAt={30} style={{ position: 'absolute', left: 1110, top: 250 }} />
        <div style={{ position: 'absolute', left: 1110, top: 720, opacity: 0.35, width: 750, color: '#9b9993', fontSize: 28, fontFamily: 'Inter, sans-serif', transform: `translateY(${lerp(20, 0, prog(f, 50, 12))}px)` }} />
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={2} />
      <Caption text="Read it like a reader would." at={14} />
    </AbsoluteFill>
  );
};
