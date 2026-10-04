import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, ToolLabel, UserBubble } from '../components';
import { CommentCard, SentimentBlock } from '../components/b/Sentiment';
import { Caption, Dm, Turn } from '../components/b/bits';
import { lerp, prog } from '../components/anim';

const CARD2 = 108;

export const Scene25: React.FC = () => {
  const f = useCurrentFrame();
  const rest = lerp(1, 0.5, prog(f, 40, 12));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-20} camera={{ scale: 1 + f * 0.0002 }}>
        <Dm o={rest}>
          <Turn><UserBubble text="What are people saying?" enterAt={0} /></Turn>
          <Turn><ToolLabel name="CLEO - Read the comments" start={6} doneAt={20} /></Turn>
          <div style={{ marginBottom: 28 }}><SentimentBlock at={17} dur={24} /></div>
        </Dm>
        <div style={{ position: 'relative', height: 300, marginBottom: 20 }}>
          <CommentCard kind="positive" name="Neha K." at={36} out={CARD2 - 2}
            text="Our debriefs end exactly like this. Zeko AI's evidence-first approach is worth a look." />
          <CommentCard kind="negative" name="Sandeep R." at={CARD2}
            text="Verified capability sounds good, but who validates the validation? I'd need bias-audit data first." />
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.text, opacity: prog(f, 122, 12), transform: `translateY(${lerp(20, 0, prog(f, 122, 12))}px)`, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: '18px 26px', lineHeight: 1.45 }}>
          <b>Concerns (14):</b> <span style={{ color: C.muted }}>bias validation</span> 6 · <span style={{ color: C.muted }}>candidate experience</span> 4 · <span style={{ color: C.muted }}>pricing/integration clarity</span> 4
        </div>
      </ChatShell>
      <Caption text="Read the room." at={12} />
    </AbsoluteFill>
  );
};
