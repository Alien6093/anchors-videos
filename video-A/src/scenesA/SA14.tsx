import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FakeCursor, FONT_SANS, KineticText, easeInOut, lerp, pop, prog } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, GoldFlash, Tick, Turn } from '../components/b/bits';
import { B_POSTS } from '../components/b/posts';
import { ORDER_BRIEF, cre, row, st } from '../components/b/kit';

const REVISED = ['ashish', 'darika', 'priyanshu'];
const CHK = ['Zeko AI in line 2', '#ZekoAI', 'Angle kept', 'No absolute claims', 'No press-release tone'];
const CLICK = 32; // 48.214s cursor clicks Approve
const WAVE0 = 34;
const WAVE_STEP = 1.8; // 0.06s per row
const FLIP_AT: Record<string, number> = { ashish: 44, darika: 52, priyanshu: 64 };
const LOCK = 65; // bar line 92 (49.286s)
const SLOW_END = 80; // 5% slow-mo for 0.5s

/** time warp: 5% speed between LOCK and SLOW_END */
const warp = (f: number) => (f < LOCK ? f : f < SLOW_END ? LOCK + (f - LOCK) * 0.05 : f - (SLOW_END - LOCK) * 0.95);

const RevisedCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = cre('ashish');
  const p = pop(f, 16, 15, 190);
  const ok = f >= CLICK + 1;
  const press = prog(f, CLICK - 3, 4) * (1 - prog(f, CLICK + 1, 9));
  return (
    <div style={{ width: 1100, boxSizing: 'border-box', background: C.cream, borderRadius: 20, padding: '26px 34px 28px', fontFamily: FONT_SANS, boxShadow: '0 30px 80px rgba(0,0,0,.5)', opacity: Math.min(1, p * 2) * lerp(1, 0.35, prog(f, 24, 6)), transform: `translateY(${lerp(70, 0, p)}px)` }}>
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
            <Tick p={prog(f, 18 + i * 2, 8)} size={30} />{c}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', background: C.orange, color: '#fff', fontSize: 26, fontWeight: 700, padding: '10px 30px', borderRadius: 12, transform: `scale(${1 - 0.08 * press})`, boxShadow: `0 0 ${14 + 20 * press}px rgba(232,116,59,.45)` }}>Approve</div>
      </div>
    </div>
  );
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_BRIEF.map((k, i) => {
    const rev = REVISED.includes(k);
    const sweep = WAVE0 + i * WAVE_STEP;
    return row(k, {
      enterAt: -20, glowAt: sweep,
      status: rev ? st<'Changes requested' | 'Approved'>([0, 'Changes requested'], [FLIP_AT[k], 'Approved']) : st<'Approved'>([0, 'Approved']),
      drafts: st([0, rev ? '2' : '1']), cr: st([0, rev ? '1 / 2' : '0 / 2']), publish: st([0, '-']),
    });
  });
  const scroll = -30 + 300 * prog(f, 30, 24, easeInOut);
  const pull = lerp(1.1, 1, prog(f, 0, 62, easeInOut));
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={0.6 * prog(f, LOCK, 6)} camera={{ scale: pull, originX: 960, originY: 300 }}>
        <div style={{ height: 20 }} />
        <Turn mb={18}><ClaudeReply text="Revised drafts are back from Ashish, Darika and Priyanshu. Each now meets the brief." start={0} wordGap={1.3} size={32} /></Turn>
        <Turn mb={26}><RevisedCard /></Turn>
        <div style={{ marginLeft: -95 }}><Board rows={rows} headerAt={-10} /></div>
        <div style={{ marginTop: 22, opacity: prog(f, 56, 8) }}><ClaudeReply text="All 8 drafts are approved." start={56} wordGap={2} size={34} /></div>
      </ChatShell>
      {f < CLICK + 14 && <FakeCursor keys={[{ f: 8, x: 1500, y: 700 }, { f: CLICK - 4, x: 1450, y: 430 }]} clicks={[CLICK]} />}
      <DateChip label="Tue 6 Oct" at={0} />
      <Caption text="Revised. 8 of 8." at={17} />
    </AbsoluteFill>
  );
};

const COUNTER_FADE = 4; // small counter cross-fades into the big graphic over 4 frames

/** Drawn in real time (outside the time warp): small counter, gold flash, big "8 of 8." */
const LockOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const counter = 5 + REVISED.filter((k) => f >= FLIP_AT[k]).length;
  const cnt = prog(f, CLICK, 8);
  const fadeOut = prog(f, LOCK, COUNTER_FADE, (t) => t);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {f >= CLICK && f < LOCK + COUNTER_FADE && (
        <div style={{ position: 'absolute', right: 30, top: 380, width: 270, textAlign: 'center', fontFamily: FONT_SANS, opacity: cnt * (1 - fadeOut), transform: `scale(${lerp(0.7, 1, cnt)})` }}>
          <div style={{ fontSize: 230, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums' }}>{counter}</div>
          <div style={{ fontSize: 80, fontWeight: 700, color: C.muted, lineHeight: 1 }}>of 8</div>
        </div>
      )}
      <GoldFlash at={LOCK} dur={34} />
      {f >= LOCK && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 40, transform: `scale(${1 + 0.0006 * (f - LOCK)})` }}>
          <KineticText size={300} wordGap={0} pulseAt={LOCK + 2} lines={[{ text: '8 of 8.', start: LOCK, accent: ['of'] }]} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const SA14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sequence from={f - warp(f)} layout="none"><Scene /></Sequence>
      <LockOverlay />
    </AbsoluteFill>
  );
};
