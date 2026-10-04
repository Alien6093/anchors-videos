import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

type Props = { children: React.ReactNode; total: number; inFrames?: number; outFrames?: number; dist?: number };

const easeIn = Easing.in(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

/** Horizontal whip pan with motion blur: enters from the right, exits to the left. */
export const Whip: React.FC<Props> = ({ children, total, inFrames = 0, outFrames = 0, dist = 700 }) => {
  const f = useCurrentFrame();
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const tin = inFrames > 0 ? interpolate(f, [0, inFrames], [1, 0], { ...clamp, easing: easeOut }) : 0;
  const tout = outFrames > 0 ? interpolate(f, [total - outFrames, total], [0, 1], { ...clamp, easing: easeIn }) : 0;
  const x = tin * dist - tout * dist;
  const blur = 26 * Math.max(tin, tout);
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
  );
};
