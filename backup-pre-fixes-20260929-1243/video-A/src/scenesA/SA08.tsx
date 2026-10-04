import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, ToolLabel, UserBubble, easeInOut, prog } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, Turn } from '../components/b/bits';
import { ORDER_BRIEF, row, st } from '../components/b/kit';

const FLIP = ['sunidhi', 'riya', 'jyoti', 'gunjan', 'shubhangi', 'darika', 'priyanshu', 'ashish'];
const FLIP0 = 16; // beat 43 (flips start)
const GAP = 7.4; // two flips per beat, last flip lands by ~+78

export const SA08: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_BRIEF.map((k, i) => {
    const at = FLIP0 + FLIP.indexOf(k) * GAP;
    return row(k, {
      enterAt: 6 + i * 1.5,
      status: st<'Awaiting draft' | 'Draft ready'>([0, 'Awaiting draft'], [at, 'Draft ready']),
      drafts: st([0, '0'], [at, '1']), cr: st([0, '0 / 2']), publish: st([0, '-']),
    });
  });
  const scroll = -30 + 110 * prog(f, 10, 70, easeInOut);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} inputGlow={0.1}>
        <Turn mb={14}><UserBubble text="Where does every creator stand?" enterAt={0} /></Turn>
        <Turn mb={16}><ToolLabel name="CLEO - Check where every creator stands" start={3} doneAt={14} /></Turn>
        <div style={{ marginLeft: -95 }}><Board rows={rows} headerAt={4} /></div>
        <div style={{ marginTop: 22, opacity: prog(f, 70, 8) }}><ClaudeReply text="All 8 drafts are in." start={70} wordGap={2} size={34} /></div>
      </ChatShell>
      <DateChip label="Sat 3 Oct" at={0} />
      <Caption text="Drafts arrive on their own." at={10} />
    </AbsoluteFill>
  );
};
