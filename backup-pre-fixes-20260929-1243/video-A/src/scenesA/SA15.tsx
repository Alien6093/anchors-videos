import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, ToolLabel, UserBubble, easeInOut, prog } from '../components';
import { Board } from '../components/b/Board';
import { Caption, DateChip, Turn } from '../components/b/bits';
import { LIVE_DATES, ORDER_LIVE, row, st } from '../components/b/kit';

const DATE0 = 22; // dates type in, 0.12s (3.6f) stagger
const RISER = 48; // beat 97
const CONFIRM = 80; // beat 99 (53.036s)

export const SA15: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ORDER_LIVE.map((k, i) => {
    const at = CONFIRM + i * 1.6;
    const known = i < 3;
    return row(k, {
      enterAt: 10 + i * 1.5,
      status: st<'Awaiting live date' | 'Scheduled'>([0, 'Awaiting live date'], [at, 'Scheduled']),
      publish: st([0, LIVE_DATES[k]]),
      typePublish: known ? { at: DATE0 + i * 3.6, text: LIVE_DATES[k] } : undefined,
      shimmerUntil: known ? undefined : at,
    });
  });
  const scroll = interpolate(f, [0, 12, 22, 46, 62, 96], [-30, -30, 130, 130, 400, 400], { extrapolateRight: 'clamp', easing: easeInOut });
  const camX = interpolate(f, [0, 96], [70, -70], { extrapolateRight: 'clamp' });
  const pulse = f > 40 ? 0.5 + 0.5 * Math.sin((f - 40) / 3) : 0;
  const ramp = prog(f, RISER, 32, (t) => t);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} camera={{ x: camX }} inputGlow={0.1}>
        <Turn mb={14}><UserBubble text="Go live tomorrow or later, staggered over three days." enterAt={0} /></Turn>
        <div style={{ opacity: 0.4 }}><Turn mb={14}><ClaudeReply text="Earliest is Wed 7 Oct. Live dates can't be changed once set (India time). Confirm each:" start={3} wordGap={1} size={30} /></Turn></div>
        <Board rows={rows} mode="dates" headerAt={8} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, marginBottom: 26 }}>
          <div style={{ fontFamily: FONT_SANS, background: C.orange, color: '#fff', fontSize: 32, fontWeight: 700, padding: '16px 40px', borderRadius: 16, opacity: prog(f, 30, 8), transform: `scale(${1 + 0.05 * pulse})`, boxShadow: `0 0 ${16 + 40 * Math.max(pulse * 0.6, ramp)}px rgba(232,116,59,${0.35 + 0.35 * pulse})` }}>Set live date</div>
        </div>
        <Turn mb={14}><UserBubble text="Confirm all." enterAt={50} style={{ display: f < 50 ? 'none' : 'flex' }} /></Turn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ORDER_LIVE.map((k, i) => <div key={k}><ToolLabel name="CLEO - Set a live date" start={56 + i * 3} doneAt={CONFIRM + i * 1.6} style={{ whiteSpace: 'nowrap', fontSize: 26 }} /></div>)}
        </div>
      </ChatShell>
      <DateChip label="Tue 6 Oct" at={0} />
      <Caption text="Set once. Final." at={10} />
    </AbsoluteFill>
  );
};
