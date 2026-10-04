import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AnchorsLogo } from '../components/AnchorsLogo';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';
import { Pill } from './kit';
import { bf, useF, useLay } from './base';

const END = bf(88);
/** Vertical anchors per format; centred on the same axis (x = W/2) in every format. */
const POS = {
  '916': { teaser: 640, logo: 800, tag: 1000, btn: 1220, sub: 1380, logoSize: 124, tagSize: 68, btnH: 150, btnSize: 68 },
  '45': { teaser: 210, logo: 350, tag: 560, btn: 800, sub: 940, logoSize: 112, tagSize: 66, btnH: 140, btnSize: 64 },
};

/** b88-b96: teaser, logo hit, line, button, sub-line with the "Part 3 of 3" chip; last 6 frames dip out to the f0 underlay. */
export const EndCard3: React.FC = () => {
  const f = useF();
  const { fmt, W } = useLay();
  if (f < END) return null;
  const t = f - END;
  const P = POS[fmt];
  const teaser = Math.min(prog(t, 0, 6), 1 - prog(t, 24, 6));
  const tag = pop(t, 15, 14, 170);
  const btn = pop(t, 30, 12, 200);
  const sub = prog(t, 45, 10);
  const dip = 1 - prog(f, 1434, 3, (x) => x);
  const bar = (top: number): React.CSSProperties => ({ position: 'absolute', left: 0, width: W, top, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center' });
  const linkLine = fmt === '916' ? 'Link in bio.' : 'Link in the first comment.';
  return (
    <AbsoluteFill style={{ opacity: dip }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% ${(P.btn / (fmt === '916' ? 1920 : 1350)) * 100}%, #3a2a22 0%, ${C.bg} 62%)` }} />
      <div style={{ ...bar(P.teaser), opacity: teaser, fontFamily: FONT_SANS, fontSize: 44, fontWeight: 600, color: 'rgba(255,255,255,.8)', textAlign: 'center', padding: '0 80px', boxSizing: 'border-box' }}>
        That is the whole campaign.<br />Start at Part 1.
      </div>
      <div style={bar(P.logo)}><AnchorsLogo size={P.logoSize} frame={t} delay={0} /></div>
      <div style={{ ...bar(P.tag), fontFamily: FONT_SANS, fontSize: P.tagSize, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, color: '#fff', textAlign: 'center', opacity: Math.min(1, tag * 2), transform: `translateY(calc(-50% + ${lerp(24, 0, Math.min(1, tag))}px))` }}>
        Run your creator campaign<br />in a chat.
      </div>
      <div style={{ ...bar(P.btn), opacity: Math.min(1, btn * 2) }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: P.btnSize, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', background: C.orange, height: P.btnH, width: 860, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(0.88, 1, Math.min(1, btn))})`, boxShadow: '0 0 60px rgba(232,116,59,.45), 0 18px 44px rgba(0,0,0,.5)' }}>Try it: anchors.in</div>
      </div>
      <div style={{ ...bar(P.sub), opacity: sub, gap: 24, alignItems: 'center', fontFamily: FONT_SANS, fontSize: 44, fontWeight: 600, color: 'rgba(255,255,255,.78)' }}>
        <span>{linkLine}</span>
        <Pill size={40} color="#fff" bg="rgba(255,255,255,.12)" style={{ border: '2px solid rgba(255,255,255,.28)' }}>Part 3 of 3</Pill>
      </div>
    </AbsoluteFill>
  );
};
