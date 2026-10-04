import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, easeInOut, lerp, pop, prog } from '../components';
import { Caption } from '../components/a/kit';
import { cre } from '../components/b/kit';
import { CREATOR_ORDER } from '../lib/consts';

const STAMP0 = 16; // beat 38
const GAP = 4.5; // 0.15s => 8th at 47.5 = beat 40

export const SA07: React.FC = () => {
  const f = useCurrentFrame();
  const w = prog(f, 0, 11, easeInOut);
  const blur = lerp(70, 0, w);
  const scale = lerp(1.14, 1, prog(f, 0, 46, easeInOut));
  const burst = prog(f, STAMP0 + 7 * GAP, 22);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}><filter id="whipA"><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.5 ? 'url(#whipA)' : undefined }}>
        <ChatShell camera={{ x: lerp(380, 0, w), scale, originX: 960, originY: 200 }}>
          <div style={{ height: 120 }} />
          <ClaudeReply text="Payment received. Briefs sent to 8 creators." start={4} wordGap={2} size={42} />
          <div style={{ display: 'flex', gap: 10, marginTop: 60, width: 1100 }}>
            {CREATOR_ORDER.map((k, i) => {
              const at = STAMP0 + i * GAP;
              const p = pop(f, at, 13, 200, 0.6);
              const s = pop(f, at + 3, 8, 260, 0.5);
              return (
                <div key={k} style={{ width: 127, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: '18px 0 20px', opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.6, 1, p)})` }}>
                  <Img src={staticFile(cre(k).photo)} style={{ width: 84, height: 84, borderRadius: 42, objectFit: 'cover' }} />
                  <div style={{ fontFamily: FONT_SANS, fontSize: 23, fontWeight: 600, color: C.text }}>{cre(k).name.split(' ')[0]}</div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 21, fontWeight: 700, color: C.green, border: `2.5px solid ${C.green}`, borderRadius: 9, padding: '2px 8px', whiteSpace: 'nowrap', transform: `scale(${lerp(2.2, 1, Math.min(1, s))}) rotate(${lerp(-14, -4, Math.min(1, s))}deg)`, opacity: Math.min(1, s * 2) }}>Brief sent</div>
                </div>
              );
            })}
          </div>
        </ChatShell>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(circle at 50% 50%, rgba(63,178,127,${0.4 * (burst > 0 && burst < 1 ? 1 - burst : 0)}), transparent ${20 + 60 * burst}%)` }} />
      <Caption text="Now the creators write." at={17} top={700} />
    </AbsoluteFill>
  );
};
