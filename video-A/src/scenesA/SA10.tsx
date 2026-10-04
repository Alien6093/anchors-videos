import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatShell, prog } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftCardA } from '../components/a/DraftCardA';
import { Caption, DateChip, Scrim } from '../components/b/bits';
import { B_POSTS, CHECKS } from '../components/b/posts';
import { cre } from '../components/b/kit';

const FLASHES = [
  { key: 'jyoti', from: 0, dur: 16, mobile: 0 },
  { key: 'gunjan', from: 16, dur: 16, mobile: 0 },
  { key: 'shubhangi', from: 32, dur: 16, mobile: 1 },
  { key: 'sunidhi', from: 48, dur: 17, mobile: 0 },
];

const Flash: React.FC<{ k: string; mobile: number }> = ({ k, mobile }) => {
  const f = useCurrentFrame();
  const c = cre(k);
  const items = CHECKS.map((label, i) => ({ label, at: 2 + i * 2 }));
  const stab = 0.3 * (1 - prog(f, 0, 5));
  return (
    <AbsoluteFill>
      <DraftCardA post={B_POSTS[k]} name={c.name} photo={c.photo} width={1000} mobile={mobile} noEnter style={{ position: 'absolute', left: 60, top: 150 }} />
      <ChecksPanel title="Claude's check against the brief" items={items} enterAt={-12} style={{ position: 'absolute', left: 1110, top: 250 }} />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${stab})` }} />
    </AbsoluteFill>
  );
};

export const SA10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30} />
      <Scrim a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0004})`, transformOrigin: '50% 55%' }}>
        {FLASHES.map((s) => (
          <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none"><Flash k={s.key} mobile={s.mobile} /></Sequence>
        ))}
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Same standard." at={9} />
    </AbsoluteFill>
  );
};
