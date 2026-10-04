import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Caption } from '../../components/b/bits';
import { FinalChat, S8_T } from '../../components/bm/FinalChat';

export const Scene08B: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={-S8_T} layout="none"><FinalChat /></Sequence>
    <Caption text="Ranks moved. Biggest reach first." at={12} out={100} />
  </AbsoluteFill>
);
