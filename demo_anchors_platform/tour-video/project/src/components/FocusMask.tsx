import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Cam, mapRect, Shot} from '../timeline';
import {C, H, W} from '../theme';

/** Dims everything but the shot's callTarget with a soft rounded cut-out and
 * a thin red glow outline. Animated in after the transition, out at the end. */
export const FocusMask: React.FC<{shot: Shot; local: number; cam: Cam}> = ({
  shot,
  local,
  cam,
}) => {
  const t = shot.callTarget;
  if (!t || shot.isHook) return null;
  const inStart = Math.max(2, shot.transIn);
  const inLen = Math.max(4, Math.min(12, Math.round(shot.dur * 0.3)));
  const outLen = Math.max(3, Math.min(7, Math.round(shot.dur * 0.18)));
  const oIn = interpolate(local, [inStart, inStart + inLen], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const oOut = interpolate(local, [shot.dur - outLen, shot.dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const o = Math.min(oIn, oOut);
  if (o <= 0.001) return null;

  const r = mapRect(cam, t);
  const pad = 14 + 46 * (1 - oIn); // focus-pull: cut-out tightens as it appears
  let x0 = r.x - pad;
  let y0 = r.y - pad;
  let x1 = r.x + r.w + pad;
  let y1 = r.y + r.h + pad;
  const m = 8;
  x0 = Math.max(m, x0);
  y0 = Math.max(m, y0);
  x1 = Math.min(W - m, x1);
  y1 = Math.min(H - m, y1);
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  const rx = Math.min(14, w / 2, h / 2);
  const id = `fm-${shot.id}`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{position: 'absolute', left: 0, top: 0}}
    >
      <defs>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect x={0} y={0} width={W} height={H} fill="white" />
          <rect
            x={x0}
            y={y0}
            width={w}
            height={h}
            rx={rx}
            fill="black"
            filter={`url(#${id}-soft)`}
          />
        </mask>
      </defs>
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="#07070a"
        opacity={0.5 * o}
        mask={`url(#${id}-mask)`}
      />
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        rx={rx}
        fill="none"
        stroke={C.red}
        strokeWidth={3}
        opacity={0.95 * o}
        filter={`url(#${id}-glow)`}
      />
    </svg>
  );
};
