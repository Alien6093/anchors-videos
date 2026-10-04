import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, ToolLabel, UserBubble, lerp, pop, prog } from '../components';
import { Caption, DateChip, Scrim, Tick, Turn } from '../components/b/bits';
import { cre } from '../components/b/kit';

const NAMES = ['riya', 'jyoti', 'gunjan', 'shubhangi', 'sunidhi'];
const T0 = 8; // beat 63.5 (34.018s)
const GAP = 16.07;

export const SA11: React.FC = () => {
  const f = useCurrentFrame();
  const at = (i: number) => T0 + i * GAP;
  const done = NAMES.filter((_, i) => f >= at(i)).length;
  const pull = 1.07 - 0.07 * prog(f, 0, 40);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn mb={16}><UserBubble text="Approve these five." enterAt={0} /></Turn>
        <Turn mb={16}><ClaudeReply text="Approve is final. I'll confirm each: Riya, Jyoti, Gunjan, Shubhangi, Sunidhi." start={3} wordGap={1.2} size={32} /></Turn>
        {NAMES.map((k, i) => <div key={k} style={{ marginBottom: 10 }}><ToolLabel name="CLEO - Approve a draft" start={at(i) - 4} doneAt={at(i) + 6} /></div>)}
      </ChatShell>
      <Scrim at={2} a={0.84} />
      <AbsoluteFill style={{ transform: `scale(${pull})`, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
        <div style={{ display: 'flex', gap: 22, fontFamily: FONT_SANS }}>
          {NAMES.map((k, i) => {
            const a = at(i);
            const enter = pop(f, 1 + i * 1.5, 14, 170);
            const ap = pop(f, a, 10, 220);
            const on = f >= a;
            const ring = prog(f, a, 22);
            return (
              <div key={k} style={{ width: 250, background: C.panel, border: `2px solid ${on ? C.green : C.border}`, borderRadius: 24, padding: '28px 0 26px', textAlign: 'center', position: 'relative', opacity: Math.min(1, enter * 2), transform: `translateY(${lerp(50, 0, enter)}px) scale(${on ? 1 + 0.05 * Math.sin(Math.min(1, prog(f, a, 12, (t) => t)) * Math.PI) : 1})` }}>
                {on && ring < 1 && <div style={{ position: 'absolute', inset: -4, borderRadius: 26, border: `4px solid ${C.orange}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.25})` }} />}
                <Img src={staticFile(cre(k).photo)} style={{ width: 130, height: 130, borderRadius: 65, objectFit: 'cover' }} />
                <div style={{ fontSize: 32, fontWeight: 600, color: C.text, margin: '14px 0 16px' }}>{cre(k).name.split(' ')[0]}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 700, borderRadius: 12, padding: '8px 20px', color: on ? '#0d3d28' : '#8dbcff', background: on ? C.green : 'rgba(106,168,255,.16)', transform: `scale(${on ? lerp(0.8, 1, Math.min(1.2, ap)) : 1})` }}>
                  {on && <Tick p={prog(f, a + 3, 8)} size={26} color="#0d3d28" filled={false} />}{on ? 'Approved' : 'Ready for review'}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 50, display: 'flex', alignItems: 'baseline', gap: 28, fontFamily: FONT_SANS }}>
          <span style={{ fontSize: 190, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, transform: `scale(${1 + 0.07 * Math.max(0, 1 - (f - at(Math.max(0, done - 1))) / 8)})`, display: 'inline-block' }}>{done}</span>
          <span style={{ fontSize: 100, fontWeight: 700, color: C.muted, letterSpacing: '-0.03em' }}>of 8</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 96, height: 16, borderRadius: 8, background: i < done ? C.green : 'rgba(255,255,255,.14)' }} />)}
        </div>
      </AbsoluteFill>
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Approve is final." at={10} />
    </AbsoluteFill>
  );
};
