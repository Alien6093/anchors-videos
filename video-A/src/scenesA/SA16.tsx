import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, LinkedInFeedCard, easeInOut, lerp, prog } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, Turn } from '../components/b/bits';
import { B_POSTS } from '../components/b/posts';
import { LIVE_DATES, ORDER_LIVE, cre, row, st } from '../components/b/kit';

const BOARD_AT = 16;
const LIVE_AT = 18;
const GAP = 9;
const DAYS = ['Wed 7', 'Thu 8', 'Fri 9'];

const Sparks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: 28 }, (_, i) => {
        const t = prog(f, (i % 7) * 1.5, 30, (x) => x);
        const ang = i * 2.399963;
        const r = 380 + (i % 5) * 90 + t * 260;
        return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(ang) * r * 1.3, top: 540 + Math.sin(ang) * r * 0.75, width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, borderRadius: 9, background: i % 3 ? C.orange : '#ffd27a', opacity: (1 - t) * 0.9 * Math.min(1, t * 6) }} />;
      })}
    </AbsoluteFill>
  );
};

export const SA16: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_LIVE.map((k, i) => row(k, {
    enterAt: BOARD_AT - 12 + i * 1.5,
    status: i < 4 ? st<'Scheduled' | 'Live'>([0, 'Scheduled'], [LIVE_AT + i * GAP, 'Live']) : st<'Scheduled'>([0, 'Scheduled']),
    publish: st([0, LIVE_DATES[k]]),
  }));
  const live = ORDER_LIVE.slice(0, 4).filter((_, i) => f >= LIVE_AT + i * GAP).length;
  const out = prog(f, 8, 18, easeInOut);
  const feed = f < 30;
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn mb={16}><ClaudeReply text="Your campaign is live. Posts go up over three days." start={BOARD_AT} wordGap={1.6} size={34} /></Turn>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18, fontFamily: FONT_SANS, opacity: prog(f, BOARD_AT + 4, 8) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 36, fontWeight: 700, color: '#5ed39d', background: 'rgba(63,178,127,.18)', padding: '10px 26px', borderRadius: 16 }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: C.green, boxShadow: `0 0 14px ${C.green}` }} />{live} Live</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#c8b4ff', background: 'rgba(182,156,255,.17)', padding: '10px 26px', borderRadius: 16 }}>{8 - live} Scheduled</div>
          <div style={{ flex: 1 }} />
          {DAYS.map((d, i) => (
            <div key={d} style={{ background: C.cream, color: C.ink, borderRadius: 14, padding: '10px 22px', fontSize: 30, fontWeight: 700, transform: `scale(${lerp(0.5, 1, prog(f, BOARD_AT + 6 + i * 3, 8))})`, opacity: prog(f, BOARD_AT + 6 + i * 3, 5) }}>{d}</div>
          ))}
        </div>
        <Board rows={rows} mode="dates" headerAt={BOARD_AT - 6} />
      </ChatShell>
      {feed && (
        <AbsoluteFill style={{ opacity: 1 - out }}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #3a2420 0%, ${C.bg} 70%)` }} />
          <Sparks />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${-out * 120}px) scale(${1.06 - 0.5 * out + f * 0.0007})` }}>
            <div style={{ position: 'absolute', transform: 'translateX(-420px) rotate(-7deg) scale(.9)', opacity: 0.85 }}>
              <LinkedInFeedCard post={B_POSTS.riya} name={cre('riya').name} photo={cre('riya').photo} width={860} enterAt={-10} reactAt={2} likes={262} comments={21} />
            </div>
            <div style={{ position: 'absolute', transform: 'translateX(430px) rotate(6deg) scale(.9)', opacity: 0.85 }}>
              <LinkedInFeedCard post={B_POSTS.gunjan} name={cre('gunjan').name} photo={cre('gunjan').photo} width={860} enterAt={-10} reactAt={3} likes={512} comments={38} />
            </div>
            <LinkedInFeedCard post={B_POSTS.ashish2} name={cre('ashish').name} photo={cre('ashish').photo} width={980} enterAt={-8} reactAt={0} likes={728} comments={63} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <DateChip label={f < BOARD_AT ? 'Wed 7 Oct' : 'Thu 8 Oct'} at={f < BOARD_AT ? 0 : BOARD_AT} />
      <Caption text="Live on LinkedIn." at={10} />
    </AbsoluteFill>
  );
};
