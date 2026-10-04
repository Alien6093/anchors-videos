import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Stage1Cut } from "./Stage1Cut";
import { FORMATS, FPS } from '../lib/format';
import { assertValidPlan } from '../lib/plan';
import { plan as p916 } from '../plans/stage1_916';
import { plan as p45 } from '../plans/stage1_45';

/** Stage-1-only entry (isolated from other stages' Root) for render/still checks. */
const Root: React.FC = () => (
  <>
    {[{ id: 'Stage1-916', plan: p916 }, { id: 'Stage1-45', plan: p45 }].map(({ id, plan }) => (
      <Composition key={id} id={id} component={Stage1Cut} defaultProps={{ plan: assertValidPlan(plan, id) }} durationInFrames={plan.totalFrames} fps={FPS} width={FORMATS[plan.format].width} height={FORMATS[plan.format].height} />
    ))}
  </>
);
registerRoot(Root);
