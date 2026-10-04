import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, ToolLabel, UserBubble } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, Turn } from '../components/b/bits';
import { ORDER_BRIEF, row, st } from '../components/b/kit';
import { prog } from '../components/anim';

const FLIP = ['sunidhi', 'riya', 'jyoti', 'gunjan', 'shubhangi', 'darika', 'priyanshu', 'ashish'];
const FLIP0 = 30; // 78.5s
const GAP = 90 / 7; // last flip at 81.5s

export const Scene15: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_BRIEF.map((k, i) => {
    const at = FLIP0 + FLIP.indexOf(k) * GAP;
    return row(k, {
      enterAt: 24 + i * 2,
      status: st<'Awaiting draft' | 'Draft ready'>([0, 'Awaiting draft'], [at, 'Draft ready']),
      drafts: st([0, '0'], [at, '1']), cr: st([0, '0 / 2']), publish: st([0, '-']),
    });
  });
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30} camera={{ scale: 1 + f * 0.0002 }}>
        <Turn><UserBubble text="Where does every creator stand?" enterAt={2} /></Turn>
        <Turn><ToolLabel name="CLEO - Check where every creator stands" start={12} doneAt={30} /></Turn>
        <div style={{ marginLeft: -95 }}><Board rows={rows} headerAt={20} /></div>
        <div style={{ marginTop: 22 }}><ClaudeReply text="All 8 drafts are in." start={128} /></div>
      </ChatShell>
      <DateChip label="Sat 3 Oct" at={2} />
      <Caption text="Drafts arrive on their own." at={14} />
    </AbsoluteFill>
  );
};
