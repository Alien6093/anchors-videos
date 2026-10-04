import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Caption } from '../../components/b/bits';
import { Whip } from '../../components/bm/Whip';
import { S5_T, SnapChat } from '../../components/bm/SnapChat';

export const Scene05B: React.FC = () => (
  <AbsoluteFill>
    <Whip total={65} outFrames={5} dist={500}>
      <Sequence from={-S5_T} layout="none"><SnapChat /></Sequence>
    </Whip>
    <Caption text="Measured against the plan." at={11} out={58} />
  </AbsoluteFill>
);
