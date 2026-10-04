import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ToolLabel, UserBubble, easeOut, lerp, prog } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftCardA } from '../components/a/DraftCardA';
import { Caption, DateChip, Scrim, Turn } from '../components/b/bits';
import { B_POSTS, CHECKS } from '../components/b/posts';
import { cre } from '../components/b/kit';

const TICK0 = 49; // beat 50 (26.786s)
const STEP = 16.07; // one check per beat
const BADGE_AT = 129; // beat 55

export const SA09: React.FC = () => {
  const f = useCurrentFrame();
  const riya = cre('riya');
  const zoom = 1 + 0.03 * prog(f, 0, 193, easeOut);
  const at = (i: number) => TICK0 + i * STEP;
  const items = CHECKS.map((label, i) => ({ label, at: at(i) }));
  const hl = {
    zeko: prog(f, at(0), 8), tags: prog(f, at(1), 8), head: prog(f, at(2), 8),
    body: Math.max(prog(f, at(3), 8), prog(f, at(4), 8)) * 0.8,
  };
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn><UserBubble text="Open Riya's draft." enterAt={0} /></Turn>
        <Turn><ToolLabel name="CLEO - Open a draft preview" start={6} doneAt={20} /></Turn>
      </ChatShell>
      <Scrim at={4} a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 100, top: 150, filter: `brightness(${lerp(1, 0.78, prog(f, at(0) - 6, 10))})` }}>
          <DraftCardA post={B_POSTS.riya} name={riya.name} photo={riya.photo} width={900} enterAt={8} showTags hl={hl} badgePop badgeAt={BADGE_AT} changeCount={0} />
        </div>
        <ChecksPanel title="Claude's check against the brief" items={items} enterAt={30} style={{ position: 'absolute', left: 1010, top: 250 }} />
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={0} top={84} />
      <Caption text="Read it like a reader would." at={22} />
    </AbsoluteFill>
  );
};
