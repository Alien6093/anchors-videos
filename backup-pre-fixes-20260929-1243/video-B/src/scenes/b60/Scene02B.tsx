import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell } from '../../components';
import { Caption } from '../../components/b/bits';
import { ContextBlock, SnapshotDateChip } from '../../components/bm/ContextBlock';
import { lerp, prog, easeInOut } from '../../components/anim';

export const Scene02B: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(50, -50, prog(f, 0, 96, easeInOut));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-100} camera={{ x }}>
        <ContextBlock />
      </ChatShell>
      <SnapshotDateChip line1="Fri 9 Oct 2026" line2="8:00 PM" at={10} out={80} />
      <Caption text="All eight have posted." at={15} out={88} />
    </AbsoluteFill>
  );
};
