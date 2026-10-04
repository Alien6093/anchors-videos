import React from 'react';
import { C, FONT_SANS } from './theme';
import { pop } from './anim';

type MarkProps = { size?: number; color?: string; /** frame + delay: dots pop in one by one */ frame?: number; delay?: number };

const DOTS: [number, number][] = [[27, 27], [73, 27], [27, 73], [73, 73]];

export const AnchorsMark: React.FC<MarkProps> = ({ size = 64, color = C.red, frame, delay = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
    {DOTS.map(([cx, cy], i) => {
      const s = frame === undefined ? 1 : pop(frame, delay + i * 4, 10, 170);
      return (
        <circle key={i} cx={cx} cy={cy} r={21} fill={color}
          style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }} />
      );
    })}
  </svg>
);

type LogoProps = { size?: number; textColor?: string; frame?: number; delay?: number; gap?: number };

/** Mark + lowercase wordmark. size = mark height in px. */
export const AnchorsLogo: React.FC<LogoProps> = ({ size = 64, textColor = '#fff', frame, delay = 0, gap }) => {
  const t = frame === undefined ? 1 : pop(frame, delay + 14, 16, 120);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gap ?? size * 0.28 }}>
      <AnchorsMark size={size} frame={frame} delay={delay} />
      <span style={{
        fontFamily: FONT_SANS, fontWeight: 800, fontSize: size * 1.02, letterSpacing: '-0.04em',
        color: textColor, lineHeight: 1, opacity: Math.min(1, t), transform: `translateX(${(1 - t) * -30}px)`,
      }}>anchors</span>
    </div>
  );
};
