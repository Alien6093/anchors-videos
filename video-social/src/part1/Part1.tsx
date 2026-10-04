import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { FmtProvider } from './ctx';
import { Backdrop, HookPill, PartChip } from './Furniture';
import { CaptionLayer } from './Captions';
import { AsksScene, HookScene, PlanScene, ReachScene } from './scenesA';
import { CreatorsScene, CutScene, DropScene } from './scenesB';
import { BriefsScene, PayScene, QuoteScene, RecapScene, SentScene } from './scenesC';
import { EndScene } from './End';
import { Fmt, SCENES, TOTAL, beat } from './tokens';
import { FPS } from '../lib/format';

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: HookScene, asks: AsksScene, plan: PlanScene, reach: ReachScene, creators: CreatorsScene, cut: CutScene,
  drop: DropScene, briefs: BriefsScene, quote: QuoteScene, pay: PayScene, sent: SentScene, recap: RecapScene,
};

const LOOP_DIP_FROM = TOTAL - 2;

const LoopDip: React.FC = () => <AbsoluteFill style={{ background: 'rgba(255,255,255,.25)' }} />;

export const Part1: React.FC<{ fmt: Fmt }> = ({ fmt }) => (
  <FmtProvider fmt={fmt}>
    <AbsoluteFill style={{ background: '#151413' }}>
      <Backdrop />
      {SCENES.filter((s) => s.id !== 'end').map((s) => {
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} layout="none">
            <Comp />
          </Sequence>
        );
      })}
      <Sequence from={beat(88)} durationInFrames={TOTAL - beat(88)} layout="none"><EndScene /></Sequence>
      <PartChip />
      <HookPill />
      <CaptionLayer />
      <Sequence from={LOOP_DIP_FROM} durationInFrames={2} layout="none"><LoopDip /></Sequence>
    </AbsoluteFill>
  </FmtProvider>
);

export const PART1_FPS = FPS;
