import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionType } from '../lib/plan';
import { easeOut, lerp, prog } from '../lib/anim';

export const TRANSITION_FRAMES = 9;

type Props = { type: TransitionType; /** scene-local frame */ frame: number; children: React.ReactNode };

/** Wraps a scene; animates its entrance (whip slide, zoom-punch, white flash). */
export const SceneTransition: React.FC<Props> = ({ type, frame, children }) => {
  if (type === 'none' || frame >= TRANSITION_FRAMES) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = prog(frame, 0, TRANSITION_FRAMES, easeOut);
  if (type === 'whip') {
    return (
      <AbsoluteFill style={{ transform: `translateX(${lerp(100, 0, t)}%)`, filter: `blur(${lerp(22, 0, t)}px)` }}>{children}</AbsoluteFill>
    );
  }
  if (type === 'zoom-punch') {
    return (
      <AbsoluteFill style={{ transform: `scale(${lerp(1.35, 1, t)})`, filter: `blur(${lerp(10, 0, t)}px)`, opacity: lerp(0.4, 1, Math.min(1, t * 3)) }}>{children}</AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ background: '#fff', opacity: 1 - t }} />
    </AbsoluteFill>
  );
};
