import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatShell } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftWidget } from '../components/b/DraftWidget';
import { Caption, DateChip, Scrim } from '../components/b/bits';
import { B_POSTS, CHECKS } from '../components/b/posts';
import { cre } from '../components/b/kit';
import { prog } from '../components/anim';

const FLASHES = [
  { key: 'jyoti', from: 0, dur: 42, mobile: 0, gap: 5 },
  { key: 'gunjan', from: 42, dur: 21, mobile: 0, gap: 2 },
  { key: 'shubhangi', from: 63, dur: 21, mobile: 1, gap: 2 },
  { key: 'sunidhi', from: 84, dur: 21, mobile: 0, gap: 2 },
];

const Flash: React.FC<{ k: string; mobile: number; gap: number }> = ({ k, mobile, gap }) => {
  const f = useCurrentFrame();
  const c = cre(k);
  const items = CHECKS.map((label, i) => ({ label, at: 3 + i * gap }));
  const stab = k === 'jyoti' ? 0 : 0.34 * (1 - prog(f, 0, 5));
  return (
    <AbsoluteFill>
      <DraftWidget post={B_POSTS[k]} name={c.name} photo={c.photo} width={1000} mobile={mobile} noEnter style={{ position: 'absolute', left: 60, top: 150 }} />
      <ChecksPanel items={items} style={{ position: 'absolute', left: 1110, top: 250 }} />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${stab})` }} />
    </AbsoluteFill>
  );
};

export const Scene17: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30} />
      <Scrim a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0004})`, transformOrigin: '50% 55%' }}>
        {FLASHES.map((s) => (
          <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none"><Flash k={s.key} mobile={s.mobile} gap={s.gap} /></Sequence>
        ))}
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Same standard." at={4} />
    </AbsoluteFill>
  );
};
