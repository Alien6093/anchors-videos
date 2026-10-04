import React from 'react';
import { Composition } from 'remotion';
import { SocialCut } from './components/SocialCut';
import { Stage2Cut } from './stage2/Stage2Cut';
import { Stage1Cut } from './stage1/Stage1Cut';
import { Stage3Cut } from './stage3/Stage3Cut';
import { Part1 } from './part1/Part1';
import { Part2Cut } from './part2/Part2Cut';
import { Part3, PART3_FRAMES } from './part3/Part3';
import { FORMATS, FPS } from './lib/format';
import { CutPlan, assertValidPlan } from './lib/plan';
import { plan as s1_916 } from './plans/stage1_916';
import { plan as s1_45 } from './plans/stage1_45';
import { plan as s2_916 } from './plans/stage2_916';
import { plan as s2_45 } from './plans/stage2_45';
import { plan as s3_916 } from './plans/stage3_916';
import { plan as s3_45 } from './plans/stage3_45';

const ENTRIES: readonly { id: string; plan: CutPlan }[] = [
  { id: 'Stage1-916', plan: s1_916 }, { id: 'Stage1-45', plan: s1_45 },
  { id: 'Stage2-916', plan: s2_916 }, { id: 'Stage2-45', plan: s2_45 },
  { id: 'Stage3-916', plan: s3_916 }, { id: 'Stage3-45', plan: s3_45 },
];

export const Root: React.FC = () => (
  <>
    {ENTRIES.map(({ id, plan }) => (
      <Composition
        key={id}
        id={id}
        component={id.startsWith('Stage2') ? Stage2Cut : id.startsWith('Stage1') ? Stage1Cut : id.startsWith('Stage3') ? Stage3Cut : SocialCut}
        defaultProps={{ plan: assertValidPlan(plan, id) }}
        durationInFrames={plan.totalFrames}
        fps={FPS}
        width={FORMATS[plan.format].width}
        height={FORMATS[plan.format].height}
      />
    ))}
    <Composition id="Part1-916" component={Part1} defaultProps={{ fmt: '916' as const }} durationInFrames={1440} fps={FPS} width={1080} height={1920} />
    <Composition id="Part1-45" component={Part1} defaultProps={{ fmt: '45' as const }} durationInFrames={1440} fps={FPS} width={1080} height={1350} />
    <Composition id="Part2-916" component={() => <Part2Cut fmt="916" />} durationInFrames={1440} fps={FPS} width={1080} height={1920} />
    <Composition id="Part2-45" component={() => <Part2Cut fmt="45" />} durationInFrames={1440} fps={FPS} width={1080} height={1350} />
    <Composition id="Part3-916" component={Part3} defaultProps={{ fmt: '916' as const }} durationInFrames={PART3_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Part3-45" component={Part3} defaultProps={{ fmt: '45' as const }} durationInFrames={PART3_FRAMES} fps={FPS} width={1080} height={1350} />
  </>
);
