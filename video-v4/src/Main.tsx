import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SCENE_COMPONENTS_A } from './scenes/indexA';
import { SCENE_COMPONENTS_B } from './scenes/indexB';
import { DURATION_FRAMES, SCENES, sec } from './lib/timing';

const FADE_IN_FRAMES = 4;
const FADE_OUT_FRAMES = 12;
const LAST_A_ID = 13;

const pickScene = (id: number): React.FC => (id <= LAST_A_ID ? SCENE_COMPONENTS_A[id] : SCENE_COMPONENTS_B[id]);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const black = Math.max(
    interpolate(f, [0, FADE_IN_FRAMES], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(f, [DURATION_FRAMES - FADE_OUT_FRAMES, DURATION_FRAMES - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <AbsoluteFill style={{ background: '#1f1e1d' }}>
      {SCENES.map((s) => {
        const Comp = pickScene(s.id);
        const from = sec(s.start);
        return (
          <Sequence key={s.id} from={from} durationInFrames={sec(s.end) - from} name={`${s.id} ${s.name}`}>
            <Comp />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: '#000', opacity: black, pointerEvents: 'none' }} />
      <Audio src={staticFile('audio/mix.wav')} volume={1} />
    </AbsoluteFill>
  );
};
