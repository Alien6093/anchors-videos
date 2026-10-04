import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Stage2Cut } from './Stage2Cut';
import { FORMATS, FPS } from '../lib/format';
import { assertValidPlan } from '../lib/plan';
import { plan as s2_916 } from '../plans/stage2_916';
import { plan as s2_45 } from '../plans/stage2_45';

/** Stage 2 only entry point (isolated from other stages' plans). */
const ENTRIES = [{ id: 'Stage2-916', plan: s2_916 }, { id: 'Stage2-45', plan: s2_45 }] as const;

const Stage2Root: React.FC = () => (
  <>
    {ENTRIES.map(({ id, plan }) => (
      <Composition key={id} id={id} component={Stage2Cut} defaultProps={{ plan: assertValidPlan(plan, id) }}
        durationInFrames={plan.totalFrames} fps={FPS} width={FORMATS[plan.format].width} height={FORMATS[plan.format].height} />
    ))}
  </>
);

registerRoot(Stage2Root);
