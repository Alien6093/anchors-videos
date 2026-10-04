import React from 'react';
import { C, FONT_SANS, FONT_SERIF } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';
import { Avatar, Bubble, Pill, ToolLine } from './kit';

const SENTENCE: { t: string; b?: boolean }[] = [
  ...["Ashish's", 'post', 'drew', '44,800', 'impressions,', '728', 'likes', 'and', '63', 'comments,', 'a'].map((t) => ({ t })),
  ...['1.77%', 'engagement', 'rate.'].map((t) => ({ t, b: true })),
];
const SENT_AT = 712;
const TABLE_AT = 765;

const Sentence: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ fontFamily: FONT_SERIF, fontSize: 52, lineHeight: 1.34, color: '#e9e5de', textWrap: 'balance' as never }}>
    {SENTENCE.map((w, i) => {
      const k = prog(f, SENT_AT + i * 2, 8);
      return (
        <span key={i} style={{ display: 'inline-block', opacity: k, transform: `translateY(${lerp(14, 0, k)}px)`, marginRight: '0.28em', color: w.b ? C.cream : undefined, fontWeight: w.b ? 700 : 400 }}>{w.t}</span>
      );
    })}
  </div>
);

const Metric: React.FC<{ f: number; at: number; label: string; value: string }> = ({ f, at, label, value }) => {
  const p = pop(f, at, 14, 190);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 8px', borderBottom: `1.5px solid ${C.border}`, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(26, 0, Math.min(1, p))}px)` }}>
      <span style={{ fontSize: 48, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 72, color: '#fff', fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
};

const PostTable: React.FC<{ f: number }> = ({ f }) => {
  const head = pop(f, TABLE_AT, 14, 190);
  const chip = pop(f, TABLE_AT + 26, 12, 200);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, fontFamily: FONT_SANS }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, transform: `scale(${lerp(0.94, 1, Math.min(1, head))})` }}>
        <Avatar k="ashish" size={104} />
        <div style={{ fontSize: 54, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', flex: 1 }}>Ashish Shukla</div>
        <Pill size={40} dot color="#5ed39d" bg="rgba(63,178,127,.2)">Published</Pill>
      </div>
      <div>
        <Metric f={f} at={TABLE_AT + 4} label="Impressions" value="44,800" />
        <Metric f={f} at={TABLE_AT + 10} label="Likes" value="728" />
        <Metric f={f} at={TABLE_AT + 16} label="Comments" value="63" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, opacity: Math.min(1, chip * 2), transform: `scale(${lerp(0.85, 1, Math.min(1, chip))})` }}>
        <Pill size={44} color={C.ink} bg={C.cream}>Campaign average 1.74%</Pill>
      </div>
    </div>
  );
};

/** f 690-809: bubble, tool line and the serif sentence, then (hard cut at b51) the native table with final values. */
export const ScenePost: React.FC<{ f: number }> = ({ f }) => {
  if (f >= TABLE_AT) return <PostTable f={f} />;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
      <Bubble instant f={f} at={690} text="How did Ashish's post do?" size={52} />
      <div style={{ opacity: prog(f, 700, 8) }}><ToolLine f={f} at={700} doneAt={716} text="How one creator performed" size={44} /></div>
      <Sentence f={f} />
    </div>
  );
};
