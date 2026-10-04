import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, C, FONT_SANS } from '../components';
import { easeInOut, lerp, pop, prog } from '../components/anim';
import { Caption, Dm, Turn } from '../components/b/bits';
import { cre, ORDER_BRIEF } from '../components/b/kit';

const STAMP0 = 20;
const GAP = 3;

export const Scene14: React.FC = () => {
  const f = useCurrentFrame();
  const w = prog(f, 0, 11, easeInOut);
  const blur = lerp(70, 0, w);
  const count = ORDER_BRIEF.filter((_, i) => f >= STAMP0 + i * GAP + 4).length;
  const burst = prog(f, STAMP0 + 7 * GAP, 22);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}><filter id="whipB"><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.5 ? 'url(#whipB)' : undefined }}>
        <ChatShell camera={{ x: lerp(380, 0, w), scale: 1.02 - 0.02 * prog(f, 0, 60) }}>
          <Dm o={0.3}><Turn><ClaudeReply text="Here's your payment link. Sign in to anchors to pay." start={-30} /></Turn></Dm>
          <Turn mb={30}><ClaudeReply text="Payment received. Briefs sent to 8 creators." start={6} wordGap={2} /></Turn>
          <div style={{ marginLeft: -100, width: 1300, fontFamily: FONT_SANS }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 22, paddingLeft: 10, opacity: prog(f, 12, 8) }}>
              <span style={{ fontSize: 34, color: C.muted }}>Briefed</span>
              <span style={{ fontSize: 96, fontWeight: 800, color: C.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{count}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {ORDER_BRIEF.map((k, i) => {
                const at = STAMP0 + i * GAP;
                const p = pop(f, at, 13, 200, 0.6);
                const s = pop(f, at + 4, 8, 260, 0.5);
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: '16px 20px', opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.6, 1, p)})` }}>
                    <Img src={staticFile(cre(k).photo)} style={{ width: 84, height: 84, borderRadius: 42, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 30, fontWeight: 600, color: C.text }}>{cre(k).name.split(' ')[0]}</div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 26, fontWeight: 700, color: C.green, border: `2.5px solid ${C.green}`, borderRadius: 10, padding: '2px 12px',
                        transform: `scale(${lerp(2.2, 1, Math.min(1, s))}) rotate(${lerp(-14, -4, Math.min(1, s))}deg)`, opacity: Math.min(1, s * 2), transformOrigin: 'left center',
                      }}>Brief sent</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChatShell>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(circle at 50% 55%, rgba(63,178,127,${0.4 * (burst > 0 && burst < 1 ? 1 - burst : 0)}), transparent ${20 + 60 * burst}%)` }} />
      <Caption text="Now the creators write." at={18} />
    </AbsoluteFill>
  );
};
