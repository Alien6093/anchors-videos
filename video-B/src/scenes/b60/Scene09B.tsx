import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell } from '../../components';
import { Caption } from '../../components/b/bits';
import { easeInOut, lerp, prog } from '../../components/anim';
import { PlanActual } from '../../components/bm/PlanActual';

export const Scene09B: React.FC = () => {
  const f = useCurrentFrame();
  // pull-back reveal: pushed through the totals row in the first frames, then eases out to full widget
  const scale = f < 12 ? lerp(1.75, 1.5, prog(f, 0, 12)) : lerp(1.5, 1, prog(f, 40, 64, easeInOut));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-100} camera={{ scale, originX: 960, originY: 200 }}>
        <PlanActual />
      </ChatShell>
      <Caption text="Beat the plan on reach and cost." at={18} out={112} />
    </AbsoluteFill>
  );
};
