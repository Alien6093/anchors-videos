import React from 'react';
import { Composition } from 'remotion';
import { MainB } from './MainB';
import { FPS_B, TOTAL_B } from './lib/timingB';

export const Root: React.FC = () => (
  <Composition id="EveryNumberOneChat" component={MainB} durationInFrames={TOTAL_B} fps={FPS_B} width={1920} height={1080} />
);
