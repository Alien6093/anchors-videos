import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Part3, PART3_FRAMES } from './Part3';
import { LAYOUT } from './base';

const P916: React.FC = () => <Part3 fmt="916" />;
const P45: React.FC = () => <Part3 fmt="45" />;

/** Part-only root so Part 3 renders independently of the shared Root. */
const Part3Root: React.FC = () => (
  <>
    <Composition id="Part3-916" component={P916} durationInFrames={PART3_FRAMES} fps={30} width={LAYOUT['916'].W} height={LAYOUT['916'].H} />
    <Composition id="Part3-45" component={P45} durationInFrames={PART3_FRAMES} fps={30} width={LAYOUT['45'].W} height={LAYOUT['45'].H} />
  </>
);

registerRoot(Part3Root);
