import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, KineticText, ReviewTable, ToolLabel, UserBubble, prog } from '../components';
import { CenterText, ROW_ORDER, dimAmt, makeRow, steps } from './shared';

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ROW_ORDER.map((k, i) => {
    const flip = 46 + i * 10;
    return makeRow(k, {
      enterAt: 34 + i * 3,
      status: [{ at: 0, v: 'Awaiting draft' }, { at: flip, v: 'Draft ready' }],
      drafts: [{ at: 0, v: '0' }, { at: flip, v: '1' }],
      publish: steps('-'),
    });
  });
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f, 40)} scrollY={prog(f, 20, 130, (t) => t) * 44} camera={{ scale: 1 + f * 0.0004, originY: 500 }}>
        <UserBubble text="Show me the drafts." enterAt={6} />
        <ToolLabel name="cleo_review_campaign" start={28} doneAt={44} style={{ marginTop: 22 }} />
        <div style={{ marginTop: 22, marginLeft: -230 }}>
          <ReviewTable rows={rows} headerAt={32} />
        </div>
        <ClaudeReply style={{ marginTop: 26 }} start={124} wordGap={1.6} text="All 8 drafts are in. Want to open one?" />
      </ChatShell>
      <CenterText>
        <KineticText size={110} wordGap={8} exitAt={38} lines={[{ text: 'All 8 drafts.', start: 0 }, { text: 'Delivered.', start: 12 }]} />
      </CenterText>
    </AbsoluteFill>
  );
};
