import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, ToolLabel, UserBubble } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, Turn } from '../components/b/bits';
import { LIVE_DATES, ORDER_LIVE, row, st } from '../components/b/kit';
import { easeInOut, lerp, prog } from '../components/anim';

const CONFIRM = 102; // confirm chime 113.4s

export const Scene22: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_LIVE.map((k, i) => {
    const at = CONFIRM + i * 3;
    const known = i < 3;
    return row(k, {
      enterAt: 34 + i * 2,
      status: st<'Awaiting live date' | 'Scheduled'>([0, 'Awaiting live date'], [at, 'Scheduled']),
      publish: st([0, LIVE_DATES[k]]),
      typePublish: known ? { at: 58 + i * 4, text: LIVE_DATES[k] } : undefined,
      shimmerUntil: known ? undefined : at,
    });
  });
  const scroll = interpolate(f, [0, 30, 44, 72, 92, 100, 116], [-30, -30, 140, 140, 520, 520, 140], { extrapolateRight: 'clamp', easing: easeInOut });
  const pulse = f > CONFIRM + 8 ? 0.5 + 0.5 * Math.sin((f - CONFIRM) / 4) : 0;
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} camera={{ scale: 1 + f * 0.00015 }}>
        <Turn><UserBubble text="Go live tomorrow or later, staggered over three days." enterAt={2} /></Turn>
        <Turn><ClaudeReply text="Earliest is Wed 7 Oct. Live dates can't be changed once set (India time). Confirm each:" start={14} wordGap={1.4} size={32} /></Turn>
        <Board rows={rows} mode="dates" headerAt={30} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, marginBottom: 26 }}>
          <div style={{ fontFamily: FONT_SANS, background: C.orange, color: '#fff', fontSize: 32, fontWeight: 700, padding: '16px 40px', borderRadius: 16, opacity: prog(f, 60, 10), transform: `scale(${1 + 0.04 * pulse})`, boxShadow: `0 0 ${16 + 40 * pulse}px rgba(232,116,59,${0.35 + 0.35 * pulse})` }}>Set live date</div>
        </div>
        <Turn mb={14}><UserBubble text="Confirm all." enterAt={76} /></Turn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ORDER_LIVE.map((k, i) => <div key={k}><ToolLabel name="CLEO - Set a live date" start={84 + i * 2.5} doneAt={CONFIRM + i * 3} style={{ whiteSpace: 'nowrap', fontSize: 26 }} /></div>)}
        </div>
      </ChatShell>
      <DateChip label="Tue 6 Oct" at={-20} />
      <Caption text="Set once. Final." at={9} />
    </AbsoluteFill>
  );
};
