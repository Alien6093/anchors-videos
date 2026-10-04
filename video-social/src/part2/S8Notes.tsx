import React from 'react';
import { useCurrentFrame } from 'remotion';
import { DraftCard } from './Cards';
import { AmberBadge, NoteBox } from './Note';
import { Stage } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';
import { DARIKA_TEXT, PRIYANSHU_TEXT } from './tokens';

const HALF = 90; // b46 = hard cut

const Sent: React.FC<{ f: number; k: string; text: string; marks: { phrase: string; at: number }[]; note: string }> = ({ f, k, text, marks, note }) => {
  const s = useS();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(22) }}>
      <DraftCard k={k} sub="First draft" text={text} marks={marks} f={f} textSize={44} avatar={72} pad={30} />
      <NoteBox f={f} start={14} cps={24} minH={170} text={note} />
      <div style={{ height: s(60), opacity: f >= 70 ? 1 : 0 }}><AmberBadge f={f - 70} /></div>
    </div>
  );
};

/** Beat 40-52: Darika (the hook card) then Priyanshu, one card at a time, hard cut at b46. */
export const S8Notes: React.FC = () => {
  const f = useCurrentFrame();
  const first = f < HALF;
  const lf = first ? f : f - HALF;
  return (
    <>
      <Cap f={lf} only="916" l916={first ? ['Hype gets', 'sent back.'] : ['So do', 'guarantees.']} l45={[]} acc916={first ? 'Hype' : 'guarantees.'} acc45="" />
      <Cap f={f} only="45" l916={[]} l45={['Hype and absolute claims', 'go back too.']} acc916="" acc45="absolute" />
      <Stage f={lf} noEnter={false}>
        {first ? (
          <Sent key="d" f={lf} k="darika" text={DARIKA_TEXT} marks={[{ phrase: 'revolutionary', at: 6 }, { phrase: "world's number one", at: 14 }]} note="Rewrite in your own strategist voice..." />
        ) : (
          <Sent key="p" f={lf} k="priyanshu" text={PRIYANSHU_TEXT} marks={[{ phrase: 'guarantees the perfect hire every time', at: 6 }, { phrase: 'the only tool', at: 16 }]} note="Remove the guarantees..." />
        )}
      </Stage>
    </>
  );
};
