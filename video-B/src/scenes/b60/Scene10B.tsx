import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, FONT_SERIF, ToolLabel, UserBubble } from '../../components';
import { Caption, Dm, Turn } from '../../components/b/bits';
import { CreatorPostTable } from '../../components/b/CreatorPostTable';
import { lerp, pop, prog } from '../../components/anim';

const DUR = 129;
const TOOL_AT = 16;
const TOOL_DONE = 32;
const SENTENCE_AT = 32;
const HIGHLIGHT_AT = 48;
const TABLE_AT = 64;
const COUNT_AT = 72;
const COUNT_LOCK = 87;
const DATE_AT = 97;
const TEXTURE_AT = 113;
const DIM = 0.35;
const DIM_FRAMES = 12;
const WORD_GAP = 1.6;
const TILT_PX = 50;
const DRIFT_MAX = 1.03;

const PRE = "Ashish's post drew 44,800 impressions, 728 likes and 63 comments, ";
const KEY = 'a 1.77% engagement rate';
const POST = '.';

const words = (text: string) => text.split(/(\s+)/).filter(Boolean);

const Sentence: React.FC<{ f: number }> = ({ f }) => {
  const hi = prog(f, HIGHLIGHT_AT, DIM_FRAMES);
  const all = lerp(1, DIM, prog(f, TABLE_AT, DIM_FRAMES));
  let idx = 0;
  const render = (text: string, kind: 'rest' | 'key') => words(text).map((w, i) => {
    if (/^\s+$/.test(w)) return <span key={`${kind}${i}`}>{w}</span>;
    const o = prog(f, SENTENCE_AT + idx++ * WORD_GAP, 5);
    const restO = lerp(1, DIM, hi);
    return (
      <span key={`${kind}${i}`} style={{
        opacity: o * (kind === 'key' ? 1 : restO),
        fontWeight: kind === 'key' ? lerp(400, 600, hi) : 400,
        color: kind === 'key' ? lerp(0, 1, hi) > 0.5 ? C.cream : C.text : C.text,
      }}>{w}</span>
    );
  });
  return (
    <div style={{ fontFamily: FONT_SERIF, fontSize: 34, lineHeight: 1.5, color: C.text, padding: '0 6px', opacity: all }}>
      {render(PRE, 'rest')}{render(KEY, 'key')}{render(POST, 'rest')}
    </div>
  );
};

const DateLine: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, DATE_AT, 10);
  const chip = pop(f, DATE_AT, 7, 190, 0.7);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 24, fontFamily: FONT_SANS, fontSize: 28, color: C.text, opacity: p, transform: `translateY(${lerp(16, 0, p)}px)` }}>
      <span>Published on <b>Wed 7 Oct 2026, 10:00 AM</b></span>
      <span style={{
        border: `2px solid ${C.cream}`, color: C.cream, borderRadius: 999, padding: '8px 26px', fontWeight: 600, fontSize: 28,
        transform: `scale(${lerp(0.5, 1, chip)})`, opacity: Math.min(1, chip * 2),
      }}>View post</span>
    </div>
  );
};

export const Scene10B: React.FC = () => {
  const f = useCurrentFrame();
  const tableDim = prog(f, DATE_AT, DIM_FRAMES);
  const tilt = TILT_PX * prog(f, HIGHLIGHT_AT, TABLE_AT - HIGHLIGHT_AT + 32, (t) => t * t * (3 - 2 * t));
  const scale = lerp(1, DRIFT_MAX, prog(f, 0, DUR, (t) => t));
  const rest = lerp(1, DIM, prog(f, TABLE_AT, DIM_FRAMES));
  const textureP = prog(f, TEXTURE_AT, 10);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-20} camera={{ scale, y: -tilt }}>
        <Dm o={rest}>
          <Turn><UserBubble text="How did Ashish's post do?" enterAt={0} /></Turn>
          <Turn><ToolLabel name="CLEO - How one creator performed" start={TOOL_AT} doneAt={TOOL_DONE} /></Turn>
        </Dm>
        <div style={{ marginBottom: 24 }}><Sentence f={f} /></div>
        <CreatorPostTable at={TABLE_AT} countAt={COUNT_AT} countDur={COUNT_LOCK - COUNT_AT} dim={tableDim} />
        <DateLine f={f} />
        <div style={{ marginTop: 18, fontFamily: FONT_SANS, fontSize: 26, color: C.text, opacity: DIM * textureP, transform: `translateY(${lerp(14, 0, textureP)}px)` }}>
          Content changed after approval: <b>No</b>
        </div>
      </ChatShell>
      <Caption text="Zoom in on one creator's post." at={TOOL_AT} out={105} />
    </AbsoluteFill>
  );
};
