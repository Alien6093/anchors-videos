import React from 'react';
import { useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { AnchorsLogo } from '../components/AnchorsLogo';
import { lerp, pop, prog } from '../lib/anim';
import { useL } from './layout';

/** b88-96 end card, shared CTA family. Centred on the safe-area midline in both formats. */
export const EndCard2: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const is916 = L.fmt === '916';
  const top = is916 ? 250 : 80;
  const bottom = is916 ? 450 : 80;
  const line = (at: number) => ({ opacity: prog(f, at, 10), transform: `translateY(${lerp(22, 0, prog(f, at, 10))}px)` });
  const teaserOpacity = prog(f, 0, 6) * (1 - prog(f, 30, 8));
  const cta = pop(f, 30, 14, 150);
  const pulse = f > 50 ? 0.5 + 0.5 * Math.sin((f - 50) / 5) : 0;
  const sc = is916 ? 1 : 0.94;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT_SANS }}>
      <div style={{ position: 'absolute', left: L.W / 2 - 650, top: (top + (L.H - bottom)) / 2 - 650, width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,58,47,.22), transparent 60%)' }} />
      <div style={{ position: 'absolute', left: L.margin, right: L.margin, top, bottom: L.H - (L.H - bottom), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transform: `scale(${sc})` }}>
        <div style={{ height: 60, marginBottom: 44, fontSize: 46, fontWeight: 700, color: C.muted, opacity: teaserOpacity, whiteSpace: 'nowrap' }}>Next: Part 3, the results</div>
        <AnchorsLogo size={130} frame={f} delay={-4} />
        <div style={{ ...line(15), marginTop: 56, fontSize: 62, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.14 }}>
          <div style={{ whiteSpace: 'nowrap' }}>Run your creator campaign</div>
          <div style={{ whiteSpace: 'nowrap' }}>in a chat.</div>
        </div>
        <div style={{ marginTop: 60, background: C.orange, color: '#fff', fontSize: 52, fontWeight: 800, padding: '26px 56px', borderRadius: 24, opacity: Math.min(1, cta * 2), transform: `scale(${lerp(0.85, 1, Math.min(1, cta)) + 0.02 * pulse})`, boxShadow: `0 0 ${20 + 50 * pulse}px rgba(232,116,59,${0.3 + 0.3 * pulse})`, whiteSpace: 'nowrap' }}>Try it: anchors.in</div>
        <div style={{ ...line(45), marginTop: 44, display: 'flex', alignItems: 'center', gap: 22, fontSize: 40, color: '#d6d3cc', whiteSpace: 'nowrap' }}>
          <span>{is916 ? 'Link in bio.' : 'Link in the first comment.'}</span>
          <span style={{ border: '2px solid rgba(255,255,255,.35)', borderRadius: 999, padding: '6px 22px', fontWeight: 800, color: '#fff' }}>Part 2 of 3</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
