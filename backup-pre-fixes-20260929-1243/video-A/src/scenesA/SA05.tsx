import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FakeCursor, FONT_SANS, UserBubble, lerp, pop, prog } from '../components';
import { Caption, Chip, ChipRow } from '../components/a/kit';
import { PAY_LABEL, PAY_RECT } from '../lib/consts';

const FORMAT_CLICK = 8; // beat 28.5
const LINK_CLICK = 24; // beat 29.5
const ATTACH_1 = 40;
const ATTACH_2 = 48;
const PAY_AT = 48; // beat 31
const PAY_CLICK = 60; // 17.0s

const Attach: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 10, 220, 0.6);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: FONT_SANS, fontSize: 27, color: C.text, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '12px 22px', opacity: Math.min(1, p * 2), transform: `translateY(${lerp(-30, 0, Math.min(1, p))}px) rotate(${lerp(-4, 0, Math.min(1, p))}deg)` }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.5l-8.5 8.5a5.5 5.5 0 0 1-8-8L13 4.500a3.500 3.500 0 0 1 5 5L9.500 18a1.500 1.500 0 0 1-2-2L15 8.500" /></svg>
      {label}
    </div>
  );
};

/** rack focus: returns style for a row that is sharp between [a, b] */
const focus = (f: number, inAt: number | null, outAt: number | null) => {
  const on = (inAt === null ? 1 : prog(f, inAt, 8)) * (outAt === null ? 1 : 1 - prog(f, outAt, 8));
  return { filter: `blur(${(1 - on) * 4}px)`, opacity: lerp(0.35, 1, on) } as React.CSSProperties;
};

export const SA05: React.FC = () => {
  const f = useCurrentFrame();
  const pay = pop(f, PAY_AT, 12, 200);
  const press = f >= PAY_CLICK ? Math.sin(Math.min(1, (f - PAY_CLICK) / 6) * Math.PI) : 0;
  return (
    <AbsoluteFill>
      <ChatShell inputGlow={0.1}>
        <div style={focus(f, null, 16)}>
          <ClaudeReply text="Which post format?" start={0} wordGap={1} size={34} />
          <ChipRow style={{ marginTop: 14 }}>
            {['Text', 'Text + image', 'Video', 'Text + carousel'].map((t, i) => <Chip key={t} label={t} enterAt={-10} sel={i === 1 ? prog(f, FORMAT_CLICK, 6) : 0} />)}
          </ChipRow>
          <UserBubble text="Text + image for all 8." enterAt={FORMAT_CLICK + 1} style={{ marginTop: 18, display: f < FORMAT_CLICK ? 'none' : 'flex' }} />
        </div>
        <div style={{ ...focus(f, 16, 36), marginTop: 22 }}>
          <ClaudeReply text="Tracking link placement" start={-10} size={34} style={{ fontWeight: 600 }} />
          <ChipRow style={{ marginTop: 14 }}>
            {['Body', 'Comments', 'No preference'].map((t, i) => <Chip key={t} label={t} enterAt={-10} sel={i === 1 ? prog(f, LINK_CLICK, 6) : 0} />)}
          </ChipRow>
        </div>
        <div style={{ ...focus(f, 36, null), marginTop: 22 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 26, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Attachments (up to 2, PNG or JPG for an image post)</div>
          <div style={{ display: 'flex', gap: 14 }}><Attach label="Zeko AI logo (PNG)" at={ATTACH_1} /><Attach label="Product screenshot (JPG)" at={ATTACH_2} /></div>
          <div style={{ marginTop: 18, opacity: prog(f, 44, 8) }}><ClaudeReply text="Briefs ready for all 8." start={44} wordGap={1.2} size={34} /></div>
        </div>
      </ChatShell>
      <div style={{
        position: 'absolute', left: PAY_RECT.x, top: PAY_RECT.y, width: PAY_RECT.w, height: PAY_RECT.h, borderRadius: 20, background: C.orange, color: '#fff', fontFamily: FONT_SANS, fontWeight: 700, fontSize: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', opacity: Math.min(1, pay * 2), transform: `translateY(${lerp(30, 0, Math.min(1, pay))}px) scale(${1 - 0.05 * press})`,
        boxShadow: `0 0 ${20 + 40 * press}px rgba(232,116,59,.5)`,
      }}>{PAY_LABEL}</div>
      <FakeCursor keys={[{ f: 0, x: 900, y: 500 }, { f: FORMAT_CLICK - 2, x: 640, y: 290 }, { f: LINK_CLICK - 2, x: 690, y: 500 }, { f: PAY_AT + 6, x: 900, y: 700 }, { f: PAY_CLICK - 2, x: 700, y: 830 }]} clicks={[FORMAT_CLICK, LINK_CLICK, PAY_CLICK]} />
      <Caption text="The small details." at={9} />
    </AbsoluteFill>
  );
};
