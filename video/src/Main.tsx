import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SCENE_COMPONENTS } from './scenes';
import { DURATION_FRAMES, SCENES, sec } from './lib/timing';

const HARD_CUT_INTO = new Set([23, 34, 44, 56]);
const OVERLAP = 8;
const FADE_IN_FRAMES = 4;
const FADE_OUT_FRAMES = 12;

/** Soft cross-dissolve (with a hint of blur) for the incoming scene. */
const SoftIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, OVERLAP], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: t, filter: t < 1 ? `blur(${(1 - t) * 4}px)` : undefined }}>{children}</AbsoluteFill>;
};

const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, FADE_IN_FRAMES], [1, 0], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(f, [DURATION_FRAMES - FADE_OUT_FRAMES, DURATION_FRAMES - 1], [0, 1], { extrapolateLeft: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(0,0,0,0.18) 100%)' }} />
      <AbsoluteFill style={{ background: '#000', opacity: Math.max(fadeIn, fadeOut) }} />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {SCENES.map((s, i) => {
      const Scene = SCENE_COMPONENTS[i];
      const next = SCENES[i + 1];
      const overlap = next && !HARD_CUT_INTO.has(next.start) ? OVERLAP : 0;
      const soft = i > 0 && !HARD_CUT_INTO.has(s.start);
      const body = soft ? <SoftIn><Scene /></SoftIn> : <Scene />;
      return (
        <Sequence key={s.id} from={sec(s.start)} durationInFrames={sec(s.end - s.start) + overlap}>
          {body}
        </Sequence>
      );
    })}
    <Finish />
    <Audio src={staticFile('audio/mix.wav')} volume={1} />
  </AbsoluteFill>
);
