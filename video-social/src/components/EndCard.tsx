import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FORMATS, Format } from '../lib/format';
import { EndCardSpec } from '../lib/plan';
import { lerp, pop, prog } from '../lib/anim';
import { AnchorsLogo } from './AnchorsLogo';
import { C, FONT_SANS } from './theme';

type Props = { spec: EndCardSpec; format: Format; /** frame relative to end card start */ frame: number };

/** Logo + wordmark + tagline + CTA pill on dark, kept inside the safe area. */
export const EndCard: React.FC<Props> = ({ spec, format, frame: f }) => {
  const fm = FORMATS[format];
  const line = (at: number) => ({ opacity: prog(f, at, 14), transform: `translateY(${lerp(24, 0, prog(f, at, 14))}px)` });
  const cta = pop(f, 40, 14, 140);
  const pulse = f > 60 ? 0.5 + 0.5 * Math.sin((f - 60) / 5) : 0;
  const scale = format === '916' ? 1 : 0.85;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT_SANS, opacity: prog(f, 0, 6) }}>
      <div style={{ position: 'absolute', left: fm.width / 2 - 650, top: fm.height / 2 - 650, width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,58,47,.22), transparent 60%)', opacity: prog(f, 0, 30) }} />
      <div style={{ position: 'absolute', left: fm.safe.side, right: fm.safe.side, top: fm.safe.top, bottom: fm.safe.bottom, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transform: `scale(${scale})` }}>
        <AnchorsLogo size={130} frame={f} delay={2} />
        <div style={{ ...line(28), marginTop: 50, fontSize: 64, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1 }}>{spec.tagline}</div>
        <div style={{ marginTop: 60, background: C.orange, color: '#fff', fontSize: 42, fontWeight: 800, padding: '26px 52px', borderRadius: 22, opacity: Math.min(1, cta * 2), transform: `scale(${lerp(0.85, 1, cta) + 0.02 * pulse})`, boxShadow: `0 0 ${20 + 50 * pulse}px rgba(232,116,59,${0.3 + 0.3 * pulse})` }}>{spec.cta}</div>
        {spec.sub && <div style={{ ...line(56), marginTop: 44, fontSize: 32, color: C.muted }}>{spec.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};
