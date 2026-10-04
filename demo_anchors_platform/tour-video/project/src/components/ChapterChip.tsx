import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {chapters, f} from '../timeline';
import {C, FONT, FPS} from '../theme';

/** Step chip ("3  Pick influencers"): slides in at the chapter start with a
 * slight oversize, settles and stays docked top-left for the chapter. */
export const ChapterChip: React.FC = () => {
  const frame = useCurrentFrame();
  const ch = chapters.find((c) => frame >= f(c.tIn) && frame < f(c.tOut));
  if (!ch) return null;
  const from = f(ch.tIn);
  const to = f(ch.tOut);
  const local = frame - from;
  const enter = spring({frame: local, fps: FPS, config: {damping: 16, stiffness: 140, mass: 0.7}});
  const dock = interpolate(local, [12, 30], [1.18, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const exit = interpolate(frame, [to - 6, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const numPop = spring({frame: local - 4, fps: FPS, config: {damping: 9, stiffness: 200, mass: 0.5}});
  const textIn = spring({frame: local - 2, fps: FPS, config: {damping: 18, stiffness: 160}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: 34,
        transformOrigin: '0% 0%',
        transform: `translateX(${(1 - enter) * -90}px) translateY(${-18 * exit}px) scale(${dock})`,
        opacity: Math.min(1, enter * 1.5) * (1 - exit),
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 26px 10px 10px',
        borderRadius: 14,
        background: C.inkSoft,
        boxShadow: '0 10px 30px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: C.red,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 26,
          transform: `scale(${numPop})`,
          boxShadow: '0 0 18px rgba(219,36,37,0.55)',
        }}
      >
        {ch.n}
      </div>
      <div
        style={{
          color: C.white,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: -0.3,
          opacity: textIn,
          transform: `translateX(${(1 - textIn) * 14}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {ch.title}
      </div>
    </div>
  );
};
