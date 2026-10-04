import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, DraftPreview, FakeCursor, KineticText, MiniDraftCard, POSTS, ReviewTable, UserBubble, prog, typedCount } from '../components';
import { CenterText, creator, dimAmt, makeRow, steps } from './shared';

const REQUEST = 'Name Zeko AI in the first two lines and add #ZekoAI.';
const SEND = 66;
const CUT = 100;

const TILES = [
  { key: 'ashish', post: POSTS.ashish1, request: REQUEST },
  { key: 'darika', post: POSTS.darika1, request: 'Too salesy. Rewrite in your own voice.' },
  { key: 'priyanshu', post: POSTS.priyanshu1, request: 'Remove the guarantees.' },
];

export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const ashish = creator('ashish');
  const typing = f >= 14 && f < SEND;
  const n = typedCount(REQUEST.length, f, 16, 44);
  const scrollY = f < CUT ? 122 + prog(f, SEND - 2, 16) * 150 : 0;
  const rows = TILES.map((t, i) => makeRow(t.key, {
    enterAt: 118 + i * 3,
    status: [{ at: 0, v: 'Draft ready' }, { at: 124 + i * 6, v: 'Changes requested' }],
    cr: [{ at: 0, v: '0 / 2' }, { at: 124 + i * 6, v: '1 / 2' }],
  }));
  return (
    <AbsoluteFill>
      <ChatShell
        dim={dimAmt(f, 34)} scrollY={scrollY} inputText={typing ? REQUEST.slice(0, n) : ''} showCaret={typing}
        inputGlow={typing ? 0.6 : 0} sendPulse={prog(f, SEND - 3, 4) * (1 - prog(f, SEND + 2, 8))}
        camera={{ scale: 0.97 + f * 0.0002, originY: 480 }}
      >
        {f < CUT ? (
          <>
            <DraftPreview post={POSTS.ashish1} name={ashish.name} photo={ashish.photo}
              status={f >= 78 ? 'changes' : 'review'} statusAt={78} changeCount={f >= 90 ? 1 : 0} changeCountAt={90} pressRequestAt={12} />
            <UserBubble text={REQUEST} enterAt={SEND + 1} style={{ marginTop: 26 }} />
          </>
        ) : (
          <div style={{ marginLeft: -120 }}>
            <div style={{ display: 'flex', gap: 40 }}>
              {TILES.map((t, i) => (
                <MiniDraftCard key={t.key} post={t.post} name={creator(t.key).name} photo={creator(t.key).photo} request={t.request}
                  enterAt={CUT + i * 5} badgeAt={CUT + 8 + i * 5} pulseAt={126} />
              ))}
            </div>
            <div style={{ marginTop: 28, marginLeft: -110 }}><ReviewTable rows={rows} rowH={54} headerAt={CUT + 14} /></div>
          </div>
        )}
      </ChatShell>
      <CenterText>
        <KineticText size={116} wordGap={8} exitAt={34} lines={[{ text: 'Three need', start: 0 }, { text: 'a nudge.', start: 12 }]} />
      </CenterText>
      <FakeCursor keys={[{ f: 0, x: 1450, y: 420 }, { f: 11, x: 1160, y: 770 }, { f: 70, x: 1200, y: 800 }, { f: 100, x: 1500, y: 900 }]} clicks={[12]} />
    </AbsoluteFill>
  );
};
