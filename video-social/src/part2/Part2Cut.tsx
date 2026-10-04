import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Format } from '../lib/format';
import { LayoutProvider } from './layout';
import { Backdrop, DateLayer, LoopDip, PartChip } from './Furniture';
import { SC } from './tokens';
import { S1Hook } from './S1Hook';
import { S2Brief } from './S2Brief';
import { S3Board } from './S3Board';
import { S4Review, S5Same } from './S4Review';
import { S6Approve } from './S6Approve';
import { S7SentBack } from './S7SentBack';
import { S8Notes } from './S8Notes';
import { S9Revised } from './S9Revised';
import { S10Count, S11Gold } from './S10Count';
import { S12Dates } from './S12Dates';
import { S13Live } from './S13Live';
import { EndCard2 } from './EndCard2';

const SCENES: readonly [readonly [number, number], React.FC][] = [
  [SC.hook, S1Hook], [SC.brief, S2Brief], [SC.board, S3Board], [SC.review, S4Review], [SC.same, S5Same],
  [SC.approve, S6Approve], [SC.sent1, S7SentBack], [SC.sent2, S8Notes], [SC.revised, S9Revised],
  [SC.count, S10Count], [SC.gold, S11Gold], [SC.dates, S12Dates], [SC.live, S13Live],
];

/** Part 2 REVIEW, 48.0 s / 1440 f. Same frame grid for both formats. */
export const Part2Cut: React.FC<{ fmt: Format }> = ({ fmt }) => (
  <LayoutProvider fmt={fmt}>
    <AbsoluteFill>
      <Backdrop />
      {SCENES.map(([[a, b], Comp]) => (
        <Sequence key={a} from={a} durationInFrames={b - a} layout="none"><Comp /></Sequence>
      ))}
      <Sequence from={0} durationInFrames={SC.end[0]} layout="none"><PartChip /></Sequence>
      <DateLayer />
      <Sequence from={SC.end[0]} durationInFrames={SC.end[1] - SC.end[0]} layout="none"><EndCard2 /></Sequence>
      <LoopDip />
    </AbsoluteFill>
  </LayoutProvider>
);
