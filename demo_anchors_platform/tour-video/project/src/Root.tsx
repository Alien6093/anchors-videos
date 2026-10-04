import React from 'react';
import {Composition} from 'remotion';
import {Tour} from './Tour';
import {TOTAL_FRAMES} from './timeline';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Tour" component={Tour} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
