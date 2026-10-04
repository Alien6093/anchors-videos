import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Caption } from '../../components/b/bits';
import { FinalChat } from '../../components/bm/FinalChat';
import { Whip } from '../../components/bm/Whip';

export const Scene07B: React.FC = () => (
  <AbsoluteFill>
    <Whip total={257} inFrames={8} dist={500}><FinalChat /></Whip>
    <Caption text="The final count." at={35} out={125} />
  </AbsoluteFill>
);
