import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Part2Cut } from './Part2Cut';
import { TOTAL, FPS } from './tokens';

const P916: React.FC = () => <Part2Cut fmt="916" />;
const P45: React.FC = () => <Part2Cut fmt="45" />;

/** Part-2-only entry (independent of the shared Root). */
export const Part2Root: React.FC = () => (
  <>
    <Composition id="Part2-916" component={P916} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Part2-45" component={P45} durationInFrames={TOTAL} fps={FPS} width={1080} height={1350} />
  </>
);
registerRoot(Part2Root);
