import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES_B } from './lib/timingB';
import { Scene01B } from './scenes/b60/Scene01B';
import { Scene02B } from './scenes/b60/Scene02B';
import { Scene03B } from './scenes/b60/Scene03B';
import { Scene04B } from './scenes/b60/Scene04B';
import { Scene05B } from './scenes/b60/Scene05B';
import { Scene06B } from './scenes/b60/Scene06B';
import { Scene07B } from './scenes/b60/Scene07B';
import { Scene08B } from './scenes/b60/Scene08B';
import { Scene09B } from './scenes/b60/Scene09B';
import { Scene10B } from './scenes/b60/Scene10B';
import { Scene11B } from './scenes/b60/Scene11B';
import { Scene12B } from './scenes/b60/Scene12B';
import { Scene13B } from './scenes/b60/Scene13B';

const COMPONENTS: Record<number, React.FC> = {
  1: Scene01B, 2: Scene02B, 3: Scene03B, 4: Scene04B, 5: Scene05B, 6: Scene06B, 7: Scene07B,
  8: Scene08B, 9: Scene09B, 10: Scene10B, 11: Scene11B, 12: Scene12B, 13: Scene13B,
};

export const MainB: React.FC = () => (
  <AbsoluteFill style={{ background: '#1f1e1d' }}>
    {SCENES_B.map((s) => {
      const Comp = COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={`${s.id} ${s.name}`}>
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
