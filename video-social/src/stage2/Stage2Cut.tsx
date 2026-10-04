import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { CutPlan } from '../lib/plan';
import { C } from '../components/theme';
import { SceneClip } from './SceneClip';
import { CAPTIONS, KICKER_916 } from './captionTable';
import { CaptionView, Kinetic916 } from './Captions';
import { HOOK_FRAMES, HookOverlay } from './HookOverlay';
import { ActsBar } from './ActsBar';
import { Disclosure, isDisclosureFrame } from './Disclosure';
import { Bridge } from './Bridge';
import { NativeEnd } from './NativeEnd';
import { Marks } from './Marks';
import { SPECS_916 } from './spec916';
import { SPECS_45 } from './spec45';
import { SceneSpec } from './spec';
import { mainBox } from './geometry';

const specsFor = (format: CutPlan['format']): readonly SceneSpec[] => (format === '916' ? SPECS_916 : SPECS_45);

const Overlays: React.FC<{ format: CutPlan['format']; specs: readonly SceneSpec[] }> = ({ format, specs }) => {
  const f = useCurrentFrame();
  const spec = specs.find((s) => f >= s.a && f < s.b) ?? specs[specs.length - 1];
  const hard = spec.view.kind === 'hard' || f < HOOK_FRAMES;
  return (
    <AbsoluteFill>
      <Marks spec={spec} format={format} />
      {isDisclosureFrame(f) && <Disclosure format={format} box={mainBox(spec, format)} hard={hard} />}
    </AbsoluteFill>
  );
};

/** Stage 2 master: EDL scenes from the plan plus Stage 2 overlays (hook, stamp, captions, acts bar, bridge, native end card). */
export const Stage2Cut: React.FC<{ plan: CutPlan }> = ({ plan }) => {
  const format = plan.format;
  const specs = specsFor(format);
  const captions = CAPTIONS[format];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {specs.map((s) => (
        <Sequence key={s.id} from={s.a} durationInFrames={s.b - s.a} layout="none">
          <SceneFrame spec={s} format={format} />
        </Sequence>
      ))}
      <Overlays format={format} specs={specs} />
      <Sequence from={0} durationInFrames={HOOK_FRAMES} layout="none"><HookOverlay format={format} /></Sequence>
      {captions.map((c) => (
        <Sequence key={c.text} from={c.a} durationInFrames={c.b - c.a} layout="none"><CaptionView format={format} cap={c} /></Sequence>
      ))}
      {format === '916' && (
        <Sequence from={KICKER_916.a} durationInFrames={KICKER_916.b - KICKER_916.a} layout="none">
          <KickerAbove />
        </Sequence>
      )}
      <ActsBar format={format} />
      <Bridge format={format} />
      <NativeEnd format={format} />
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{ spec: SceneSpec; format: CutPlan['format'] }> = ({ spec, format }) => {
  const f = useCurrentFrame();
  return <SceneClip spec={spec} format={format} frame={f} />;
};

const KICKER_BOTTOM = 1520;

/** 9:16 kicker "Revised." sits above the counter, the numeral itself being the caption. */
const KickerAbove: React.FC = () => (
  <Kinetic916 text={KICKER_916.text} accent={-1} frames={KICKER_916.b - KICKER_916.a} size={72} bottom={KICKER_BOTTOM} />
);
