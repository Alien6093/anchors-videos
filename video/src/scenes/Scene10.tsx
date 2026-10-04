import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, KineticText, LinkedInFeedCard, POSTS, ReviewTable, lerp, prog } from '../components';
import { CenterText, REVISED, ROW_ORDER, SCHEDULE, creator, dimAmt, makeRow } from './shared';

const FAN = [
  { post: POSTS.jyoti, key: 'jyoti', rot: -9, x: 940, y: 210, at: 96, likes: 289, comments: 35 },
  { post: POSTS.ashish2, key: 'ashish', rot: 8, x: 1100, y: 190, at: 100, likes: 728, comments: 63 },
  { post: POSTS.darika2, key: 'darika', rot: 15, x: 1130, y: 260, at: 104, likes: 1085, comments: 72 },
];

export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const split = prog(f, 82, 18);
  const riya = creator('riya');
  const rows = ROW_ORDER.map((k, i) => {
    const revised = REVISED.includes(k);
    const at = 15 + i * 8;
    return makeRow(k, {
      enterAt: -20,
      status: [{ at: 0, v: 'Scheduled' }, { at, v: 'Live' }],
      drafts: [{ at: 0, v: revised ? '2' : '1' }],
      cr: [{ at: 0, v: revised ? '1 / 2' : '0 / 2' }],
      publish: [{ at: 0, v: `Scheduled: ${SCHEDULE[k]}` }, { at, v: `Published: ${SCHEDULE[k]}` }],
    });
  });
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f, 40, 0.55)} camera={{ scale: 0.97 + f * 0.0002, originY: 470 }}>
        <div style={{
          transformOrigin: '0% 20%', opacity: lerp(1, 0.45, split), filter: split > 0.01 ? `blur(${split * 2}px)` : undefined,
          transform: `translateX(${lerp(0, -380, split)}px) scale(${lerp(1, 0.66, split)})`,
        }}>
          <div style={{ marginLeft: -230 }}><ReviewTable rows={rows} rowH={60} headerAt={-20} /></div>
          <ClaudeReply style={{ marginTop: 26, marginLeft: 0 }} start={56} text="Your campaign is live." />
        </div>
      </ChatShell>
      {FAN.map((c) => (
        <div key={c.key} style={{ position: 'absolute', left: c.x, top: c.y, transform: `rotate(${c.rot}deg)`, opacity: 0.9 }}>
          <LinkedInFeedCard post={c.post} name={creator(c.key).name} photo={creator(c.key).photo} width={640} enterAt={c.at} reactAt={-200} likes={c.likes} comments={c.comments} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 1000, top: 120 }}>
        <LinkedInFeedCard post={POSTS.riya} name={riya.name} photo={riya.photo} width={780} enterAt={88} reactAt={98} likes={262} />
      </div>
      <CenterText>
        <KineticText size={122} wordGap={8} exitAt={44} lines={[{ text: 'Live on', start: 4 }, { text: 'LinkedIn.', start: 13 }]} />
      </CenterText>
    </AbsoluteFill>
  );
};
