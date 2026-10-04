import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, ToolLabel, UserBubble } from '../../components';
import { CommentCard, SentimentBlock } from '../../components/b/Sentiment';
import { Caption, Dm, Turn } from '../../components/b/bits';
import { lerp, prog } from '../../components/anim';

const SENT = 34;
const CARD1 = 49;
const CARD2 = 121;
const CONCERNS = 166;

export const Scene11B: React.FC = () => {
  const f = useCurrentFrame();
  const rest = lerp(1, 0.35, prog(f, SENT + 30, 12));
  const scale = lerp(1, 1.06, prog(f, 0, 193, (t) => t));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-70} camera={{ scale, originY: 300 }}>
        <Dm o={rest}>
          <Turn><UserBubble text="What are people saying?" enterAt={0} /></Turn>
          <Turn><ToolLabel name="CLEO - Read the comments" start={6} doneAt={26} /></Turn>
          <div style={{ marginBottom: 28 }}><SentimentBlock at={SENT} dur={30} /></div>
        </Dm>
        <div style={{ position: 'relative', height: 262, marginBottom: 14 }}>
          <CommentCard kind="positive" name="Neha K." at={CARD1} out={CARD2 - 2}
            text="Our debriefs end exactly like this. Zeko AI's evidence-first approach is worth a look." />
          <CommentCard kind="negative" name="Sandeep R." at={CARD2}
            text="Verified capability sounds good, but who validates the validation? I'd need bias-audit data first." />
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.text, opacity: 0.35 * prog(f, CONCERNS, 12), transform: `translateY(${lerp(20, 0, prog(f, CONCERNS, 12))}px)`, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: '12px 24px', lineHeight: 1.4 }}>
          <b>Concerns (14):</b> <span style={{ color: C.muted }}>bias validation</span> 6 · <span style={{ color: C.muted }}>candidate experience</span> 4 · <span style={{ color: C.muted }}>pricing/integration clarity</span> 4
        </div>
      </ChatShell>
      <Caption text="Praise and pushback. Both shown." at={16} out={112} />
    </AbsoluteFill>
  );
};
