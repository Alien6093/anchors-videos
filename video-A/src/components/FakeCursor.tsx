import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C } from './theme';
import { easeInOut } from './anim';

export type CursorKey = { f: number; x: number; y: number };

type Props = { keys: CursorKey[]; clicks?: number[]; size?: number };

/** Arrow cursor gliding between keyframes with click ripples. Coordinates are canvas px. */
export const FakeCursor: React.FC<Props> = ({ keys, clicks = [], size = 46 }) => {
  const f = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const x = interpolate(f, fs, keys.map((k) => k.x), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut });
  const y = interpolate(f, fs, keys.map((k) => k.y), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut });
  const opacity = interpolate(f, [fs[0], fs[0] + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const press = clicks.reduce((m, c) => {
    const d = f - c;
    return d >= 0 && d < 8 ? Math.max(m, Math.sin((d / 8) * Math.PI)) : m;
  }, 0);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none', zIndex: 50 }}>
      {clicks.map((c) => {
        const d = f - c;
        if (d < 0 || d > 20) return null;
        const t = d / 20;
        return (
          <div key={c} style={{
            position: 'absolute', left: x - 40 * (0.3 + t), top: y - 40 * (0.3 + t), width: 80 * (0.3 + t), height: 80 * (0.3 + t),
            borderRadius: '50%', border: `4px solid ${C.orange}`, opacity: 1 - t,
          }} />
        );
      })}
      <svg width={size} height={size} viewBox="0 0 24 24" style={{
        position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.16 * press})`, transformOrigin: '3px 2px',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.45))',
      }}>
        <path d="M3 2l7.2 18 2.6-7.4L20.2 10z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
