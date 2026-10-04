import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT_SANS } from './theme';

type Props = { title: string; kicker: string; hue?: number; width: number; height: number };

/** Brand-style post visual drawn in code: gradient, capability bars, headline, wordmark. */
export const ZekoPostImage: React.FC<Props> = ({ title, kicker, hue = 262, width, height }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 40) * 12;
  const u = height / 260;
  const bars = [0.42, 0.68, 0.55, 0.9, 0.74];
  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden', fontFamily: FONT_SANS,
      background: `linear-gradient(125deg, hsl(${hue} 70% 18%) 0%, hsl(${hue + 26} 72% 34%) 60%, hsl(${hue + 50} 80% 52%) 100%)`,
    }}>
      <div style={{ position: 'absolute', right: -60 * u + drift, top: -80 * u, width: 300 * u, height: 300 * u, borderRadius: '50%', background: `radial-gradient(circle, hsla(${hue + 60},90%,70%,.45), transparent 65%)` }} />
      <svg style={{ position: 'absolute', right: 26 * u, bottom: 26 * u }} width={190 * u} height={110 * u} viewBox="0 0 190 110">
        {bars.map((b, i) => (
          <rect key={i} x={i * 38} y={110 - b * 100} width={26} height={b * 100} rx={7} fill={i === 3 ? '#fff' : 'rgba(255,255,255,.35)'} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 34 * u, top: 30 * u, right: 240 * u }}>
        <div style={{ fontSize: 15 * u, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>{kicker}</div>
        <div style={{ marginTop: 12 * u, fontSize: 38 * u, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff' }}>{title}</div>
      </div>
      <div style={{ position: 'absolute', left: 34 * u, bottom: 26 * u, fontSize: 24 * u, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Zeko AI</div>
    </div>
  );
};
