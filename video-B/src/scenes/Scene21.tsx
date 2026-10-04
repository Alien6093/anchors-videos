import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FakeCursor, FONT_SANS, KineticText } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, GoldFlash, Tick, Turn } from '../components/b/bits';
import { B_POSTS } from '../components/b/posts';
import { ORDER_BRIEF, cre, row, st } from '../components/b/kit';
import { easeInOut, lerp, pop, prog } from '../components/anim';

const REVISED = ['ashish', 'darika', 'priyanshu'];
const CHK = ['Zeko AI in line 2', '#ZekoAI', 'Angle kept', 'No absolute claims', 'No press-release tone'];
const WAVE = 45; // 106.0s
const WAVE_STEP = 24 / 7; // 8 ticks 106.0-106.8
const APPROVE_AT = 14; // click 14, Approved 15 (gold impact 105.0)

const RevisedCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = cre('ashish');
  const p = pop(f, 0, 15, 190);
  const ok = f >= APPROVE_AT + 1;
  const press = prog(f, APPROVE_AT - 3, 4) * (1 - prog(f, APPROVE_AT + 1, 9));
  return (
    <div style={{ width: 1100, boxSizing: 'border-box', background: C.cream, borderRadius: 20, padding: '26px 34px 28px', fontFamily: FONT_SANS, boxShadow: '0 30px 80px rgba(0,0,0,.5)', opacity: Math.min(1, p * 2), transform: `translateY(${lerp(70, 0, p)}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Img src={staticFile(a.photo)} style={{ width: 72, height: 72, borderRadius: 36, objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>Ashish Shukla</div>
          <div style={{ fontSize: 24, color: C.inkSoft }}>Revised draft · Change requests: 1 / 2</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: ok ? '#17784D' : '#2B5FB8', background: ok ? '#DCF3E6' : '#E5EDFA', padding: '8px 18px', borderRadius: 12 }}>{ok ? 'Approved' : 'Ready for review'}</div>
      </div>
      <div style={{ marginTop: 16, fontSize: 27, lineHeight: 1.38, color: '#222' }}>
        <div style={{ opacity: 0.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{B_POSTS.ashish2.opening[0]}</div>
        <div style={{ marginTop: 6, background: 'rgba(255,214,120,.5)', borderRadius: 6, padding: '2px 6px', marginLeft: -6 }}>{B_POSTS.ashish2.opening[1]}</div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: '8px 22px', alignItems: 'center' }}>
        {CHK.map((c, i) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 25, color: C.ink, fontWeight: 500 }}>
            <Tick p={prog(f, 1 + i * 2, 8)} size={30} />{c}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', background: C.orange, color: '#fff', fontSize: 26, fontWeight: 700, padding: '10px 30px', borderRadius: 12, transform: `scale(${1 - 0.08 * press})`, boxShadow: `0 0 ${14 + 20 * press}px rgba(232,116,59,.45)` }}>Approve</div>
      </div>
    </div>
  );
};

export const Scene21: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_BRIEF.map((k, i) => {
    const wave = WAVE + i * WAVE_STEP;
    const rev = REVISED.includes(k);
    return row(k, {
      enterAt: -20, glowAt: wave,
      status: rev ? st<'Changes requested' | 'Approved'>([0, 'Changes requested'], [wave, 'Approved']) : st<'Approved'>([0, 'Approved']),
      drafts: st([0, rev ? '2' : '1']), cr: st([0, rev ? '1 / 2' : '0 / 2']), publish: st([0, '-']),
    });
  });
  const scroll = interpolate(f, [0, 50, 78], [-30, -30, 500], { extrapolateRight: 'clamp', easing: easeInOut });
  const k8 = prog(f, 93, 6);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={0.6 * k8} camera={{ scale: 1 + f * 0.00015 }}>
        <Turn><ClaudeReply text="Revised drafts are back from Ashish, Darika and Priyanshu. Each now meets the brief." start={0} wordGap={1.3} size={34} /></Turn>
        <Turn mb={26}><RevisedCard /></Turn>
        <div style={{ marginLeft: -95 }}><Board rows={rows} headerAt={-10} /></div>
        <div style={{ marginTop: 22 }}><ClaudeReply text="All 8 drafts are approved." start={80} size={34} /></div>
      </ChatShell>
      <GoldFlash at={15} />
      <GoldFlash at={93} dur={34} />
      {f >= 93 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 40, transform: `scale(${1 + 0.0006 * (f - 93)})` }}>
          <KineticText size={300} wordGap={7} pulseAt={110} lines={[{ text: '8 of 8.', start: 93, accent: ['of'] }]} />
        </AbsoluteFill>
      )}
      <FakeCursor keys={[{ f: 0, x: 1500, y: 700 }, { f: 12, x: 1450, y: 430 }]} clicks={[APPROVE_AT]} />
      <DateChip label="Tue 6 Oct" at={2} />
      <Caption text="Revised. Approved." at={15} out={62} />
    </AbsoluteFill>
  );
};
