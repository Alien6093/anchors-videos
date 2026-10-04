import React from 'react';
import { Composition } from 'remotion';
import { MainA } from './MainA';
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from './lib/timingA';

export const Root: React.FC = () => (
  <Composition id="BriefReviewApprove" component={MainA} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
