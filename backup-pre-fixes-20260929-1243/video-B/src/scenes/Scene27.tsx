import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components';
import { lerp, pop, prog, easeInOut } from '../components/anim';

const DOTS: [number, number][] = [[27, 27], [73, 27], [27, 73], [73, 73]];
const CIRC = 2 * Math.PI * 21;

export const Scene27: React.FC = () => {
  const f = useCurrentFrame();
  const size = 170;
  const line = (at: number) => ({ opacity: prog(f, at, 14), transform: `translateY(${lerp(24, 0, prog(f, at, 14))}px)` });
  const cta = pop(f, 62, 14, 140);
  const pulse = f > 84 ? 0.5 + 0.5 * Math.sin((f - 84) / 6) : 0;
  const word = prog(f, 20, 22, easeInOut);
  return (
    <AbsoluteFill style={{ background: C.bg, alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS }}>
      <div style={{ position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,58,47,.22), transparent 60%)', opacity: prog(f, 0, 30), transform: `scale(${1 + f * 0.0008})` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.28 }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          {DOTS.map(([cx, cy], i) => {
            const d = prog(f, i * 1.5 - 6, 12);
            const fill = prog(f, i * 1.5 - 2, 8);
            return <circle key={i} cx={cx} cy={cy} r={21} fill={C.red} fillOpacity={fill} stroke={C.red} strokeWidth={3} strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - d)} transform={`rotate(-90 ${cx} ${cy})`} />;
          })}
        </svg>
        <div style={{ overflow: 'hidden', clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`, transform: `translateX(${lerp(-40, 0, word)}px)` }}>
          <span style={{ fontWeight: 800, fontSize: size * 1.02, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>anchors</span>
        </div>
      </div>
      <div style={{ ...line(40), marginTop: 46, fontSize: 64, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Run your creator campaign in a chat.</div>
      <div style={{ marginTop: 54, background: C.orange, color: '#fff', fontSize: 40, fontWeight: 700, padding: '24px 56px', borderRadius: 20, opacity: Math.min(1, cta * 2), transform: `scale(${lerp(0.85, 1, cta) + 0.02 * pulse})`, boxShadow: `0 0 ${20 + 50 * pulse}px rgba(232,116,59,${0.3 + 0.3 * pulse})` }}>Connect anchors to Claude → anchors.in</div>
      <div style={{ ...line(80), marginTop: 44, fontSize: 32, color: C.muted }}>Zeko AI, live on LinkedIn.</div>
    </AbsoluteFill>
  );
};
