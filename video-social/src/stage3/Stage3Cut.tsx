import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { CutPlan, placeScenes } from '../lib/plan';
import { C } from '../components/theme';
import { SceneLayerAt } from './SceneLayer';
import { Captions } from './Captions';
import { Callouts } from './Callouts';
import { HookBlack, HookText } from './Hook';
import { TimeJump } from './TimeJump';
import { Table3 } from './Table3';
import { EndCard3 } from './EndCard3';
import { Progress } from './Progress';
import { T } from './tokens';

const Overlays: React.FC<{ format: CutPlan['format'] }> = ({ format }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < T.hookEnd && <HookText format={format} frame={f} />}
      {f >= T.hookEnd && f < T.hookBlackEnd && <HookBlack format={format} frame={f} />}
      <TimeJump format={format} frame={f} />
      <Table3 format={format} frame={f} />
      <Captions format={format} frame={f} />
      <Callouts format={format} frame={f} />
      <Progress format={format} frame={f} />
      <EndCard3 format={format} frame={f} />
    </AbsoluteFill>
  );
};

/** Stage 3 master: spliced live-metrics film with hops, native cards, captions, callouts, progress bar and loop bridge. */
export const Stage3Cut: React.FC<{ plan: CutPlan }> = ({ plan }) => {
  const placed = placeScenes(plan.scenes);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {placed.map((p, i) => (
        <Sequence key={p.scene.id} from={p.from} durationInFrames={p.frames} layout="none">
          <SceneLayerAt scene={p.scene} prev={placed[i - 1]?.scene} format={plan.format} />
        </Sequence>
      ))}
      <Overlays format={plan.format} />
    </AbsoluteFill>
  );
};
