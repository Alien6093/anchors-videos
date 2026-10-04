import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, FakeCursor, UserBubble, prog, lerp, easeInOut, C, FONT_SANS, pop } from '../components';
import { Caption, PAY_RECT, Rise, ToolLine } from '../components/a/kit';
import { QuoteTable } from '../components/a/QuoteTable';

export const PAY_LABEL = 'Pay Rs 1,47,000 on anchors ->';
export const CLICK = 117; // 69.4s
const TOTAL_AT = 87; // 68.4s lock click

export const Scene12: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = prog(f, 70, 30, easeInOut) * 150;
  const chipP = pop(f, 104, 12, 190);
  const press = prog(f, CLICK, 4) * (1 - prog(f, CLICK + 4, 8));
  const swell = prog(f, CLICK + 4, 14, easeInOut);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={0.6 * prog(f, CLICK + 4, 14)}>
        <UserBubble text="What does it cost?" enterAt={0} />
        <div style={{ marginTop: 14 }}><ToolLine label="CLEO - What this campaign costs" start={6} doneAt={20} /></div>
        <div style={{ marginTop: 16 }}><QuoteTable at={20} totalAt={TOTAL_AT} /></div>
        <Rise at={96} style={{ marginTop: 14 }}><ClaudeReply text="Nothing is charged until you pay." start={96} wordGap={1.4} size={32} /></Rise>
        <div style={{ marginTop: 14 }}><ToolLine label="CLEO - Get the payment link" start={100} doneAt={110} /></div>
        <div style={{ marginTop: 18, visibility: f > CLICK + 3 ? 'hidden' : 'visible', opacity: Math.min(1, chipP * 2), transform: `translateY(${lerp(30, 0, Math.min(1, chipP))}px)` }}>
          <div style={{
            display: 'inline-block', fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, color: '#fff', background: C.orange, borderRadius: 20, padding: '22px 44px',
            transform: `scale(${1 - 0.04 * press + 0.05 * swell})`, boxShadow: `0 0 ${50 * swell}px rgba(232,116,59,.7)`,
          }}>{PAY_LABEL.replace('->', '→')}</div>
        </div>
      </ChatShell>
      {f > CLICK + 3 && (
        <div style={{
          position: 'absolute', left: PAY_RECT.x, top: PAY_RECT.y, width: PAY_RECT.w, height: PAY_RECT.h, boxSizing: 'border-box', borderRadius: 20, background: C.orange, color: '#fff',
          fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${50 * swell}px rgba(232,116,59,.7)`, 
        }}>{PAY_LABEL.replace('->', '→')}</div>
      )}
      <FakeCursor keys={[{ f: 96, x: 1300, y: 560 }, { f: 116, x: 700, y: 694 }]} clicks={[CLICK]} />
      <Caption text="Every rupee, itemised." at={6} />
    </AbsoluteFill>
  );
};
