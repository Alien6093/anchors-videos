import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {chapters, endCard, f} from '../timeline';
import {C, FONT} from '../theme';

/** Segmented chapter progress: one segment per chapter, the current one
 * widens to show its title and fills in brand red. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  if (!chapters.length) return null;
  const start = f(chapters[0].tIn);
  const end = f(endCard.tIn);
  const vis =
    interpolate(frame, [start, start + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
    interpolate(frame, [end - 10, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (vis <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 20,
        width: 1440,
        transform: `translateX(-50%) translateY(${(1 - vis) * 20}px)`,
        opacity: vis,
        display: 'flex',
        gap: 8,
        padding: '10px 18px 12px',
        borderRadius: 14,
        background: 'rgba(17,17,17,0.92)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
        fontFamily: FONT,
      }}
    >
      {chapters.map((c) => {
        const a = f(c.tIn);
        const b = f(c.tOut);
        // how "current" this chapter is (eased over 10 f at the boundaries)
        const cur =
          interpolate(frame, [a - 1, a + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) *
          interpolate(frame, [b - 1, b + 9], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
        const fill = interpolate(frame, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const past = frame >= b;
        return (
          <div key={c.n} style={{flex: 1 + 2.9 * cur, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7}}>
            <div
              style={{
                height: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                color: C.white,
                opacity: 0.5 + 0.5 * cur,
                fontSize: 20,
                lineHeight: '24px',
              }}
            >
              <span style={{fontWeight: 800, color: cur > 0.5 ? '#ff6a6f' : C.white}}>{c.n}</span>
              <span style={{fontWeight: 600, opacity: cur, letterSpacing: -0.1}}>{c.title}</span>
            </div>
            <div style={{height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.18)', overflow: 'hidden'}}>
              <div
                style={{
                  height: '100%',
                  width: `${(past ? 1 : fill) * 100}%`,
                  borderRadius: 3,
                  background: past ? 'rgba(255,255,255,0.72)' : C.red,
                  boxShadow: past ? undefined : '0 0 10px rgba(219,36,37,0.8)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
