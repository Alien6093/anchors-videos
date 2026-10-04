import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { CutPlan, placeScenes, secToFrame } from '../lib/plan';
import { CroppedClip } from './CroppedClip';
import { SceneTransition } from './SceneTransition';
import { KineticCaption } from './KineticCaption';
import { Callout } from './Callout';
import { HookFlash } from './HookFlash';
import { ProgressBar } from './ProgressBar';
import { EndCard } from './EndCard';
import { C } from './theme';

const DEFAULT_HOOK_SEC = 1.5;

const SceneView: React.FC<{ plan: CutPlan; index: number }> = ({ plan, index }) => {
  const f = useCurrentFrame();
  const placed = placeScenes(plan.scenes)[index];
  const { scene } = placed;
  const cap = scene.caption;
  return (
    <AbsoluteFill>
      <SceneTransition type={scene.transitionIn ?? 'none'} frame={f}>
        <CroppedClip scene={scene} format={plan.format} frame={f} />
      </SceneTransition>
      {cap && (
        <Sequence from={secToFrame(cap.inSec)} durationInFrames={Math.max(1, secToFrame(cap.outSec - cap.inSec))} layout="none">
          <CaptionAt plan={plan} index={index} />
        </Sequence>
      )}
      {(scene.callouts ?? []).map((c, i) => (
        <Sequence key={`${c.text}-${i}`} from={secToFrame(c.inSec)} durationInFrames={Math.max(1, secToFrame(c.outSec - c.inSec))} layout="none">
          <CalloutAt plan={plan} index={index} calloutIndex={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const CaptionAt: React.FC<{ plan: CutPlan; index: number }> = ({ plan, index }) => {
  const f = useCurrentFrame();
  const cap = plan.scenes[index].caption;
  if (!cap) return null;
  return <KineticCaption caption={cap} format={plan.format} frame={f} durationFrames={secToFrame(cap.outSec - cap.inSec)} />;
};

const CalloutAt: React.FC<{ plan: CutPlan; index: number; calloutIndex: number }> = ({ plan, index, calloutIndex }) => {
  const f = useCurrentFrame();
  const c = plan.scenes[index].callouts?.[calloutIndex];
  if (!c) return null;
  return <Callout callout={c} format={plan.format} frame={f} durationFrames={secToFrame(c.outSec - c.inSec)} />;
};

const HookAt: React.FC<{ plan: CutPlan; frames: number }> = ({ plan, frames }) => {
  const f = useCurrentFrame();
  return plan.hook ? <HookFlash text={plan.hook.text} format={plan.format} frame={f} durationFrames={frames} /> : null;
};

const EndAt: React.FC<{ plan: CutPlan }> = ({ plan }) => {
  const f = useCurrentFrame();
  return plan.endCard ? <EndCard spec={plan.endCard} format={plan.format} frame={f} /> : null;
};

const ProgressAt: React.FC<{ plan: CutPlan }> = ({ plan }) => {
  const f = useCurrentFrame();
  return <ProgressBar format={plan.format} frame={f} totalFrames={plan.totalFrames} />;
};

/** Renders a whole CutPlan: scenes, overlays, hook, progress bar and end card. */
export const SocialCut: React.FC<{ plan: CutPlan }> = ({ plan }) => {
  const hookFrames = secToFrame(plan.hook?.durationSec ?? DEFAULT_HOOK_SEC);
  const endFrames = plan.endCard ? secToFrame(plan.endCard.durationSec) : 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {placeScenes(plan.scenes).map((p, i) => (
        <Sequence key={p.scene.id} from={p.from} durationInFrames={p.frames} layout="none">
          <SceneView plan={plan} index={i} />
        </Sequence>
      ))}
      {plan.progressBar !== false && <ProgressAt plan={plan} />}
      {plan.hook && (
        <Sequence from={0} durationInFrames={hookFrames} layout="none">
          <HookAt plan={plan} frames={hookFrames} />
        </Sequence>
      )}
      {plan.endCard && (
        <Sequence from={plan.totalFrames - endFrames} durationInFrames={endFrames} layout="none">
          <EndAt plan={plan} />
        </Sequence>
      )}
      {plan.overlay && <plan.overlay format={plan.format} />}
    </AbsoluteFill>
  );
};
