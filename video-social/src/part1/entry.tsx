import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Part1 } from './Part1';
import { FPS, SPEC, TOTAL } from './tokens';

/** Part-1-only entry (isolated from the shared Root) for stills and renders. */
const Root: React.FC = () => (
  <>
    <Composition id="Part1-916" component={Part1} defaultProps={{ fmt: '916' as const }} durationInFrames={TOTAL} fps={FPS} width={SPEC['916'].width} height={SPEC['916'].height} />
    <Composition id="Part1-45" component={Part1} defaultProps={{ fmt: '45' as const }} durationInFrames={TOTAL} fps={FPS} width={SPEC['45'].width} height={SPEC['45'].height} />
  </>
);
registerRoot(Root);
