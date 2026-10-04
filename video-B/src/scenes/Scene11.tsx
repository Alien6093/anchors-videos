import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, UserBubble, prog, lerp, C, FONT_SANS, pop } from '../components';
import { Caption, Chip, ChipRow, Rise } from '../components/a/kit';

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


export const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const dim1 = prog(f, 34, 8) * 0.45;
  const dim2 = prog(f, 62, 8) * 0.45;
  const linkTyped = 'anchors.in/t/ZK2610-ASH'.slice(0, Math.round(23 * prog(f, 58, 12)));
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale: 1.02, originX: 960, originY: 500 }} scrollY={prog(f, 60, 30) * 60}>
        <div style={{ opacity: 1 - dim1 }}>
          <ClaudeReply text="Which post format: text, text + image, video or text + carousel?" start={0} wordGap={1.2} size={34} />
          <ChipRow style={{ marginTop: 14 }}>
            {['Text', 'Text + image', 'Video', 'Text + carousel'].map((t, i) => <Chip key={t} label={t} enterAt={4 + i * 4} sel={i === 1 ? prog(f, 18, 6) : 0} />)}
          </ChipRow>
        </div>
        <UserBubble text="Text + image for all 8." enterAt={28} style={{ marginTop: 20, display: f < 28 ? 'none' : 'flex', opacity: 1 }} />
        <div style={{ opacity: 1 - dim2, marginTop: 20 }}>
          <Rise at={38}><ClaudeReply text="Set for all 8. Where should the tracking link go: body, comments or no preference?" start={38} wordGap={1.2} size={34} /></Rise>
          <ChipRow style={{ marginTop: 14 }}>
            {['Body', 'Comments', 'No preference'].map((t, i) => <Chip key={t} label={t} enterAt={46 + i * 3} sel={i === 1 ? prog(f, 54, 6) : 0} />)}
          </ChipRow>
          <div style={{ marginTop: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 27, color: C.muted, height: 36 }}>{linkTyped}</div>
        </div>
        <Rise at={62} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 27, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Attachments (up to 2, PNG or JPG for an image post)</div>
          <div style={{ display: 'flex', gap: 14 }}><Attach label="Zeko AI logo (PNG)" at={66} /><Attach label="Product screenshot (JPG)" at={77} /></div>
        </Rise>
        <Rise at={88} style={{ marginTop: 22 }}><ClaudeReply text="Briefs ready for all 8. Next: the quote." start={88} wordGap={1.2} size={34} /></Rise>
      </ChatShell>
      <Caption text="The small details." at={8} />
    </AbsoluteFill>
  );
};
