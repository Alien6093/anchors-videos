import React from 'react';
import {interpolate, spring} from 'remotion';
import {Shot, shots} from '../timeline';
import {C, FONT, FPS, H, W} from '../theme';

/** Big bold per-shot line for the cold-open hook: the whole phrase pops in
 * within ~5 frames so it is readable for most of the 1 s shot. */
export const HookText: React.FC<{shot: Shot; local: number}> = ({shot, local}) => {
  if (!shot.isHook || !shot.callout) return null;
  const words = shot.callout.split(/\s+/);
  const lastHook = shots.filter((s) => s.isHook).slice(-1)[0];
  const isFinale = lastHook && lastHook.id === shot.id;
  // whole phrase pops in at once (readable by ~frame 6), with a punchy scale
  const start = 1;
  const sp = spring({
    frame: local - start,
    fps: FPS,
    config: {damping: 13, stiffness: 320, mass: 0.5},
  });
  const scale = interpolate(sp, [0, 1], [1.35, 1]);
  const opacity = interpolate(local - start, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = interpolate(local - start, [0, 4], [10, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: W,
        height: H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 30px',
          maxWidth: 1600,
          transform: `scale(${scale})`,
          opacity,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 124,
          letterSpacing: -3,
          lineHeight: 1.05,
          color: C.white,
          textShadow: '0 6px 40px rgba(0,0,0,0.55)',
        }}
      >
        {words.map((wd, i) => {
          const accent = /\d/.test(wd) || (isFinale && i === words.length - 1);
          return (
            <span key={i} style={{display: 'inline-block', color: accent ? C.redLight : C.white}}>
              {wd}
            </span>
          );
        })}
      </div>
    </div>
  );
};
