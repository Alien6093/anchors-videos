import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, FakeCursor, UserBubble, prog, easeInOut, lerp } from '../components';
import { Caption, Chip, ChipRow, GroupLabel, ToolLine, DIM } from '../components/a/kit';

const AUD = ['HR professionals', 'Talent acquisition teams', 'Business leaders', 'Enterprise executives', 'Job candidates'];
const MOT = ['Awareness (default)', 'Engagement', 'Traffic', 'Conversions', 'Product Launch', 'Sales', 'Audience Growth'];
const CLICKS = [75, 96, 117];
const BUBBLE_AT = 125;

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const sel = (i: number) => prog(f, CLICKS[i], 6);
  const dimOf = (i: number) => prog(f, CLICKS[i] + 4, 12);
  const cam = { x: lerp(50, -30, prog(f, 0, 130, easeInOut)) };
  const scroll = prog(f, BUBBLE_AT - 4, 26, easeInOut) * 430;
  const lapse = Math.round(41 * prog(f, 140, 36));
  return (
    <AbsoluteFill>
      <ChatShell camera={cam} scrollY={scroll} inputGlow={0.1}>
        <ClaudeReply text="I read zeko.ai. Three choices." start={2} />
        <GroupLabel text="Audience" enterAt={10} dim={dimOf(0) * 0} />
        <ChipRow>
          {AUD.map((a, i) => <Chip key={a} label={a} enterAt={12 + i * 6} sel={i === 0 ? sel(0) : 0} dim={i === 0 ? 0 : dimOf(0)} />)}
        </ChipRow>
        <GroupLabel text="Product" enterAt={40} />
        <ChipRow><Chip label="Zeko AI Platform" enterAt={42} sel={sel(1)} /></ChipRow>
        <GroupLabel text="Motive" enterAt={50} />
        <ChipRow>
          {MOT.map((a, i) => <Chip key={a} label={a} enterAt={52 + i * 6} sel={i === 0 ? sel(2) : 0} dim={i === 0 ? 0 : dimOf(2)} />)}
        </ChipRow>
        <div style={{ marginTop: 36 }}><UserBubble text="HR professionals. Awareness. Zeko AI Platform." enterAt={BUBBLE_AT} style={{ display: f < BUBBLE_AT ? 'none' : 'flex' }} /></div>
        <div style={{ marginTop: 24 }}>
          <ToolLine label="CLEO - Build the full campaign plan" start={140} doneAt={200} chip={`Time-lapse 0:${String(lapse).padStart(2, '0')}`} />
        </div>
      </ChatShell>
      <FakeCursor keys={[{ f: 55, x: 900, y: 380 }, { f: 72, x: 480, y: 250 }, { f: 93, x: 500, y: 445 }, { f: 114, x: 500, y: 640 }, { f: 124, x: 700, y: 700 }]} clicks={CLICKS} />
      <Caption text="Three choices. Yours." at={10} />
    </AbsoluteFill>
  );
};
