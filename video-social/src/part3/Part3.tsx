import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Backdrop, Caption, Card, PartChip } from './Chrome';
import { EndCard3 } from './EndCard3';
import { FrameOverride, LAYOUT, LayCtx, Fmt, useF } from './base';
import { SceneAudience } from './SceneAudience';
import { SceneComments } from './SceneComments';
import { SceneCount } from './SceneCount';
import { SceneHook } from './SceneHook';
import { ScenePlan } from './ScenePlan';
import { ScenePost } from './ScenePost';
import { SceneRecap } from './SceneRecap';
import { SceneTwoWeeks, SceneUpdate } from './SceneTime';

export const PART3_FRAMES = 1440;
const SEAM_AT = 1434;

const SceneSwitch: React.FC<{ f: number }> = ({ f }) => {
  if (f < 180) return <SceneHook f={f} />;
  if (f < 240) return <SceneTwoWeeks f={f} />;
  if (f < 300) return <SceneUpdate f={f} />;
  if (f < 510) return <SceneCount f={f} />;
  if (f < 690) return <ScenePlan f={f} />;
  if (f < 810) return <ScenePost f={f} />;
  if (f < 990) return <SceneComments f={f} />;
  if (f < 1170) return <SceneAudience f={f} />;
  if (f < 1320) return <SceneRecap f={f} />;
  return null;
};

const Frame: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Card><SceneSwitch f={f} /></Card>
      <Caption />
      <PartChip />
    </AbsoluteFill>
  );
};

export const Part3: React.FC<{ fmt: Fmt }> = ({ fmt }) => (
  <LayCtx.Provider value={LAYOUT[fmt]}>
    <AbsoluteFill style={{ background: '#1f1e1d' }}>
      <Underlay />
      <EndCard3 />
    </AbsoluteFill>
  </LayCtx.Provider>
);

/** Normal frame; during the last 6 frames it is the f0 state so the end card dips out onto the first frame (loop seam). */
const Underlay: React.FC = () => {
  const f = useF();
  if (f < SEAM_AT) return <Frame />;
  const bright = Math.max(0, Math.min(1, (f - (SEAM_AT + 3) + 1) / 3));
  return <AbsoluteFill style={{ opacity: bright }}><FrameOverride value={0}><Frame /></FrameOverride></AbsoluteFill>;
};
