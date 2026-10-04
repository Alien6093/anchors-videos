import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CalendarChip, ChatShell, FakeCursor, KineticText, ReviewTable, ToolLabel, UserBubble, lerp, prog, typedCount } from '../components';
import { CenterText, REVISED, ROW_ORDER, SCHEDULE, TopText, dimAmt, makeRow } from './shared';

const PROMPT = 'Go live next Tuesday, 10 AM.';
const SEND = 58;

export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const typing = f >= 15 && f < SEND;
  const n = typedCount(PROMPT.length, f, 15, 21);
  const rows = ROW_ORDER.map((k, i) => {
    const revised = REVISED.includes(k);
    const at = 92 + i * 2.5;
    return makeRow(k, {
      enterAt: -20,
      status: [{ at: 0, v: 'Approved' }, { at, v: 'Scheduled' }],
      drafts: [{ at: 0, v: revised ? '2' : '1' }],
      cr: [{ at: 0, v: revised ? '1 / 2' : '0 / 2' }],
      publish: [{ at: 0, v: 'Live date awaiting' }],
      publishType: { at: 88 + i * 3, text: `Scheduled: ${SCHEDULE[k]}` },
    });
  });
  const pulse = f > 104 ? 0.5 + 0.5 * Math.sin(f / 3.5) : 0;
  const press = prog(f, 128, 4) * (1 - prog(f, 132, 9));
  return (
    <AbsoluteFill>
      <ChatShell
        dim={dimAmt(f, 36)} inputText={typing ? PROMPT.slice(0, n) : ''} showCaret={typing} inputGlow={typing ? 0.6 : 0}
        sendPulse={prog(f, SEND - 3, 4) * (1 - prog(f, SEND + 2, 8))} camera={{ scale: 0.96 + f * 0.0002, originY: 470 }}
      >
        <UserBubble text={PROMPT} enterAt={SEND + 1} />
        <div style={{ position: 'relative', marginTop: 20 }}>
          <ToolLabel name="cleo_set_live_date" start={60} doneAt={80} />
          <div style={{ position: 'absolute', right: 0, top: -12 }}><CalendarChip enterAt={90} /></div>
        </div>
        <div style={{ marginTop: 20, marginLeft: -230 }}><ReviewTable rows={rows} rowH={56} headerAt={-20} /></div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div style={{
            background: '#E8743B', color: '#fff', fontSize: 32, fontWeight: 700, padding: '14px 44px', borderRadius: 16, fontFamily: 'inherit',
            transform: `scale(${1 + 0.04 * pulse - 0.08 * press})`, boxShadow: `0 0 ${10 + 40 * pulse}px rgba(232,116,59,${0.25 + 0.45 * pulse})`,
            opacity: prog(f, 84, 8), translate: `0 ${lerp(20, 0, prog(f, 84, 10))}px`,
          }}>Set live date</div>
        </div>
      </ChatShell>
      <CenterText>
        <KineticText size={116} wordGap={8} exitAt={36} lines={[{ text: 'Now, pick', start: 0 }, { text: 'the day.', start: 12 }]} />
      </CenterText>
      <TopText opacity={prog(f, 88, 4) * (1 - prog(f, 134, 10))}>
        <KineticText size={100} wordGap={8} lines={[{ text: 'Set live.', start: 90, accent: ['live.'] }]} />
      </TopText>
      <FakeCursor keys={[{ f: 70, x: 1500, y: 500 }, { f: 100, x: 1100, y: 700 }, { f: 127, x: 990, y: 852 }]} clicks={[129]} />
    </AbsoluteFill>
  );
};
