import React from 'react';
import {interpolate, spring} from 'remotion';
import {Shot, shots} from '../timeline';
import {C, FONT, FPS, H, W} from '../theme';

/** Big bold per-shot line for the cold-open hook, revealed word by word. */
export const HookText: React.FC<{shot: Shot; local: number}> = ({shot, local}) => {
  if (!shot.isHook || !shot.callout) return null;
  const words = shot.callout.split(/\s+/);
  const lastHook = shots.filter((s) => s.isHook).slice(-1)[0];
  const isFinale = lastHook && lastHook.id === shot.id;
  const gap = isFinale ? 6 : 3;
  const start = Math.max(2, Math.round(shot.transIn * 0.5));

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
          const s = spring({
            frame: local - start - i * gap,
            fps: FPS,
            config: {damping: 14, stiffness: 180, mass: 0.6},
          });
          const blur = interpolate(s, [0, 1], [12, 0], {extrapolateRight: 'clamp'});
          const accent = /\d/.test(wd) || (isFinale && i === words.length - 1);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 50}px) scale(${0.9 + 0.1 * s})`,
                opacity: Math.min(1, s * 1.4),
                filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
                color: accent ? C.redLight : C.white,
              }}
            >
              {wd}
            </span>
          );
        })}
      </div>
    </div>
  );
};
