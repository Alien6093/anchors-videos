import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, easeInOut, lerp, pop, prog } from '../components';
import { Caption } from '../components/b/bits';
import { cre } from '../components/b/kit';
import { CREATOR_ORDER } from '../lib/consts';

const Pill: React.FC<{ k: string; at: number }> = ({ k, at }) => {
  const f = useCurrentFrame();
  const c = cre(k);
  const p = pop(f, at, 12, 200);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '9px 30px 9px 9px', fontFamily: FONT_SANS, fontSize: 36, color: C.text, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(30, 0, Math.min(1, p))}px) scale(${lerp(0.7, 1, Math.min(1, p))})` }}>
      <Img src={staticFile(c.photo)} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
      {c.name.split(' ')[0]}
    </div>
  );
};

export const SA02: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(70, -30, prog(f, 0, 64, easeInOut));
  return (
    <AbsoluteFill>
      <ChatShell camera={{ x }} inputGlow={0.1}>
        <div style={{ height: 150 }} />
        <div style={{ opacity: 0.35 }}><ClaudeReply text="Done. Roster is 8, budget capped at Rs 1,50,000." start={0} wordGap={1.4} size={38} /></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 40 }}>
          {CREATOR_ORDER.map((k, i) => <Pill key={k} k={k} at={16 + i * 4.5} />)}
        </div>
      </ChatShell>
      <Caption text="Eight creators to brief." at={9} />
    </AbsoluteFill>
  );
};
