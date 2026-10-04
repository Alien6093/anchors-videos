import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Caption } from '../../components/b/bits';
import { SnapChat } from '../../components/bm/SnapChat';

/** Scene 3 (T 0-161 of the snapshot chat): impressions alone, then the tiles. */
export const Scene03B: React.FC = () => (
  <AbsoluteFill>
    <SnapChat />
    <Caption text="Day three. Still climbing." at={33} out={124} />
  </AbsoluteFill>
);
