import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { AnchorsLogo } from '../components/AnchorsLogo';
import { easeOut, pop, prog } from '../lib/anim';
import { useFmt } from './ctx';

const TEASER_END = 30;

export const EndScene: React.FC = () => {
  const f = useCurrentFrame();
  const { is916 } = useFmt();
  const teaser = f < TEASER_END ? 1 - prog(f, TEASER_END - 6, 6) : 0;
  const lineP = prog(f, 15, 8, easeOut);
  const btn = f >= 30 ? pop(f, 30, 11, 200, 0.7) : 0;
  const subP = prog(f, 45, 8, easeOut);
  const cx = 540;
  const cy = is916 ? 860 : 675;
  const logoSize = is916 ? 120 : 104;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_SANS }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 46%, #2a2724 0%, #161514 70%)' }} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: cy - (is916 ? 300 : 250), textAlign: 'center', fontSize: 50, fontWeight: 700, color: C.orange, opacity: teaser }}>Next: Part 2, the drafts</div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: cy - (is916 ? 190 : 150), display: 'flex', justifyContent: 'center' }}>
        <AnchorsLogo size={logoSize} frame={f + 16} />
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: cy + (is916 ? 20 : 4), textAlign: 'center', fontSize: is916 ? 76 : 70, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', opacity: lineP, transform: `translateY(${(1 - lineP) * 14}px)` }}>
        <div>Run your creator campaign</div>
        <div>in a chat.</div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: cy + (is916 ? 250 : 200), display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '30px 70px', borderRadius: 999, background: C.orange, color: '#fff', fontSize: 62, fontWeight: 800, letterSpacing: '-0.02em', transform: `scale(${btn})`, opacity: Math.min(1, btn * 2), boxShadow: '0 20px 60px rgba(232,116,59,.45)' }}>Try it: anchors.in</div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: cy + (is916 ? 420 : 370), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, opacity: subP, fontSize: 44, fontWeight: 600, color: '#d8d3cc' }}>
        <span>{is916 ? 'Link in bio.' : 'Link in the first comment.'}</span>
        <span style={{ padding: '8px 26px', borderRadius: 999, border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontWeight: 800 }}>Part 1 of 3</span>
      </div>
    </AbsoluteFill>
  );
};
