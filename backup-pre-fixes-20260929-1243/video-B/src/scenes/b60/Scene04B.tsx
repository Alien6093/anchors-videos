import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Caption } from '../../components/b/bits';
import { S4_T, SnapChat } from '../../components/bm/SnapChat';

export const Scene04B: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={-S4_T} layout="none"><SnapChat /></Sequence>
    <Caption text="Every creator, ranked by reach." at={16} out={104} />
  </AbsoluteFill>
);
