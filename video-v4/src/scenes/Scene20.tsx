import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS } from '../components';
import { Caption, DateChip, MarkedText, Scrim } from '../components/b/bits';
import { DARIKA_FIRST, DARIKA_MARKS, PRIYANSHU_FIRST, PRIYANSHU_MARKS } from '../components/b/posts';
import { cre } from '../components/b/kit';
import { lerp, pop, prog, typedCount } from '../components/anim';

type PanelProps = { k: string; text: string; marks: string[]; note: string; enterAt: number; noteAt: number; badgeAt: number };

const Panel: React.FC<PanelProps> = ({ k, text, marks, note, enterAt, noteAt, badgeAt }) => {
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
        <MarkedText text={text} marks={marks} at={enterAt + 16} gap={11} />{k === 'darika' ? '' : ' ...'}
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

export const Scene20: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30} />
      <Scrim a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0003})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 80, top: 170 }}>
          <Panel k="darika" text={DARIKA_FIRST} marks={DARIKA_MARKS} note="Rewrite in your own strategist voice..." enterAt={0} noteAt={39} badgeAt={80} />
        </div>
        <div style={{ position: 'absolute', left: 980, top: 170 }}>
          <Panel k="priyanshu" text={PRIYANSHU_FIRST.split(' No more')[0]} marks={PRIYANSHU_MARKS} note="Remove the guarantees..." enterAt={6} noteAt={63} badgeAt={90} />
        </div>
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Two more." at={4} />
    </AbsoluteFill>
  );
};
