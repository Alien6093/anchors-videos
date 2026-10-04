import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Cam, Shot} from '../timeline';
import {C, FPS, H, W} from '../theme';

const LIFE = 24;

/** Expanding brand-red rings at each recorded click, mapped through the
 * live camera so they stay glued to the real cursor position. */
export const ClickRipples: React.FC<{shot: Shot; local: number; cam: Cam}> = ({
  shot,
  local,
  cam,
}) => {
  const items = shot.clicks
    .map((c, i) => ({c, i, age: local - Math.round(c.t * FPS)}))
    .filter(({age}) => age >= 0 && age < LIFE);
  if (!items.length) return null;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
    >
      {items.map(({c, i, age}) => {
        const x = c.x * cam.s + cam.tx;
        const y = c.y * cam.s + cam.ty;
        const ring = (delay: number, maxR: number) => {
          const a = age - delay;
          if (a < 0) return null;
          const p = interpolate(a, [0, LIFE - delay], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const r = interpolate(p, [0, 1], [10, maxR], {
            easing: Easing.out(Easing.cubic),
          });
          const op = interpolate(p, [0, 0.15, 1], [0, 1, 0]);
          const sw = interpolate(p, [0, 1], [6, 1.5]);
          return (
            <g key={delay} opacity={op}>
              <circle cx={x} cy={y} r={r} fill="none" stroke="white" strokeWidth={sw + 3} opacity={0.55} />
              <circle cx={x} cy={y} r={r} fill="none" stroke={C.red} strokeWidth={sw} />
            </g>
          );
        };
        const dotOp = interpolate(age, [0, 3, 12], [0, 0.85, 0], {
          extrapolateRight: 'clamp',
        });
        const dotR = interpolate(age, [0, 4, 12], [4, 16, 12], {
          extrapolateRight: 'clamp',
        });
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={dotR} fill={C.red} opacity={dotOp * 0.45} />
            {ring(0, 70)}
            {ring(6, 52)}
          </g>
        );
      })}
    </svg>
  );
};
