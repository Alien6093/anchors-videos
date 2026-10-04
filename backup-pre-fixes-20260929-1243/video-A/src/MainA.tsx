import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES_A } from './lib/timingA';
import { SCENE_MAP } from './scenesA';

export const MainA: React.FC = () => (
  <AbsoluteFill style={{ background: '#1f1e1d' }}>
    {SCENES_A.map((s) => {
      const Comp = SCENE_MAP[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={`${s.id} ${s.name}`}>
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
