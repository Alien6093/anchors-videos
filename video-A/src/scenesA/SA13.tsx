import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, lerp, pop, prog, typedCount } from '../components';
import { Caption, DateChip, MarkedText, Scrim } from '../components/b/bits';
import { DARIKA_FIRST, PRIYANSHU_FIRST } from '../components/b/posts';
import { cre } from '../components/b/kit';

const UNDERLINE_AT = 16; // beat 79
const NOTE_AT = 64; // beat 82
const BADGE_AT = 112; // beat 85

type PanelProps = { k: string; text: string; marks: string[]; note: string; enterAt: number; noteAt: number; badgeAt: number; ellipsis?: boolean };

const Panel: React.FC<PanelProps> = ({ k, text, marks, note, enterAt, noteAt, badgeAt, ellipsis }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 14, 170);
  const bp = pop(f, badgeAt, 11, 200);
  const c = cre(k);
  return (
    <div style={{ width: 860, background: C.cream, borderRadius: 22, padding: '30px 36px 32px', boxSizing: 'border-box', fontFamily: FONT_SANS, boxShadow: '0 30px 80px rgba(0,0,0,.5)', opacity: Math.min(1, p * 2), transform: `translateY(${lerp(120, 0, p)}px) scale(${lerp(0.94, 1, p)})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Img src={staticFile(c.photo)} style={{ width: 84, height: 84, borderRadius: 42, objectFit: 'cover' }} />
        <div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.ink }}>{c.name}</div>
          <div style={{ fontSize: 26, color: C.inkSoft }}>First draft</div>
        </div>
      </div>
      <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.5, color: '#222', minHeight: 300 }}>
        <MarkedText text={text} marks={marks} at={UNDERLINE_AT + (k === 'darika' ? 0 : 8)} gap={11} />{ellipsis ? ' ...' : ''}
      </div>
      <div style={{ marginTop: 18, borderLeft: `5px solid ${C.orange}`, paddingLeft: 20, fontSize: 32, lineHeight: 1.4, color: C.ink, minHeight: 50, fontWeight: 500 }}>
        {note.slice(0, typedCount(note.length, f, noteAt, 30))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 18, alignItems: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#C2410C', background: '#FFE6D6', padding: '9px 20px', borderRadius: 12, opacity: Math.min(1, bp * 2), transform: `scale(${lerp(0.7, 1, Math.min(1.2, bp))})` }}>Changes requested</div>
        <div style={{ fontSize: 26, color: C.ink, opacity: Math.min(1, bp * 2) }}>Change requests: 1 / 2</div>
      </div>
    </div>
  );
};

export const SA13: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30} />
      <Scrim a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0003})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 80, top: 170 }}>
          <Panel k="darika" text={DARIKA_FIRST} marks={['revolutionary', "world's number one"]} note="Rewrite in your own strategist voice..." enterAt={0} noteAt={NOTE_AT} badgeAt={BADGE_AT} />
        </div>
        <div style={{ position: 'absolute', left: 980, top: 170 }}>
          <Panel k="priyanshu" text={PRIYANSHU_FIRST} marks={['guarantees the perfect hire every time', 'the only tool']} note="Remove the guarantees..." enterAt={6} noteAt={NOTE_AT + 8} badgeAt={BADGE_AT + 3} />
        </div>
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={-20} top={84} />
      <Caption text="Two more." at={9} />
    </AbsoluteFill>
  );
};
