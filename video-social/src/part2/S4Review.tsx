import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C } from '../components/theme';
import { CheckPanel, DraftCard } from './Cards';
import { Stage } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';
import { CHECKS } from './tokens';
import { pop } from '../lib/anim';

const EXCERPTS: Record<string, { text: string; tags: string }> = {
  riya: { text: "Zeko AI made me revisit a question I've asked on many interview panels: is our interview really structured?", tags: '#ZekoAI #StructuredInterviewing' },
  jyoti: { text: 'I review resumes for a living, and Zeko AI caught my eye for one reason...', tags: '#ZekoAI #ATS' },
  gunjan: { text: 'A structured interview with an unstructured decision is just a nicer-looking gut call.', tags: '#ZekoAI #TalentDecisions' },
  shubhangi: { text: 'Zeko AI is built around a gap I keep seeing in recruitment ops: the hunch.', tags: '#ZekoAI #Recruitment' },
  sunidhi: { text: 'Three interviewers. Three different opinions of the same candidate.', tags: '#ZekoAI #HRLeaders' },
};

const ReadyBadge: React.FC<{ f: number }> = ({ f }) => {
  const s = useS();
  return (
    <span style={{
      display: 'inline-block', background: '#DCEBFF', color: '#1456b8', fontWeight: 800, fontSize: s(40), borderRadius: 999,
      padding: `${s(6)}px ${s(20)}px`, whiteSpace: 'nowrap', transform: `scale(${Math.min(1.05, pop(f, 0, 12, 200))})`,
    }}>Ready for review</span>
  );
};

const Review: React.FC<{ k: string; f: number; tickAt: number[]; badgeAt: number; hl: boolean }> = ({ k, f, tickAt, badgeAt, hl }) => {
  const s = useS();
  const ex = EXCERPTS[k];
  const marks = hl
    ? [{ phrase: 'Zeko AI', at: tickAt[0], kind: 'fill' as const, color: C.amber }, { phrase: '#ZekoAI', at: tickAt[1], kind: 'fill' as const, color: C.amber }]
    : [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(22) }}>
      <DraftCard
        k={k} short text={ex.text} tags={ex.tags} f={f} marks={marks} textSize={46} avatar={72} pad={30}
        right={f >= badgeAt ? <ReadyBadge f={f - badgeAt} /> : null}
      />
      <CheckPanel items={CHECKS.map((label, i) => ({ label, at: tickAt[i] }))} f={f} />
    </div>
  );
};

/** Beat 12-20: Riya's draft, five checks tick one per beat, then "Ready for review". */
export const S4Review: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Cap f={f} l916={['Claude checks', 'every draft.']} l45={['Every draft is checked', 'against the brief.']} acc916="checks" acc45="checked" />
      <Stage f={f}>
        <Review k="riya" f={f} tickAt={[15, 30, 45, 60, 75]} badgeAt={90} hl />
      </Stage>
    </>
  );
};

const FLASH_KEYS = ['jyoti', 'gunjan', 'shubhangi', 'sunidhi'];

/** Beat 20-24: four 1-beat flashes (hard cuts), same five ticks each. */
export const S5Same: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(3, Math.floor(f / 15));
  const lf = f - idx * 15;
  return (
    <>
      <Cap f={f} l916={['Same checks.', 'Every draft.']} l45={['The same checks run', 'on every draft.']} acc916="Same" acc45="same" />
      <Stage f={lf} noEnter>
        <Review key={idx} k={FLASH_KEYS[idx]} f={lf} tickAt={[1, 3, 5, 7, 9]} badgeAt={10} hl={false} />
      </Stage>
    </>
  );
};
