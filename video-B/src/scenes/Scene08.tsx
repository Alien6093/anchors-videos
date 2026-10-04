import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, KineticText, UserBubble, prog, easeInOut, lerp } from '../components';
import { Caption, Rise, ToolLine } from '../components/a/kit';
import { WidgetA } from '../components/a/WidgetA';
import { RosterTiles } from '../components/a/RosterTiles';
import { BeforeAfter } from '../components/a/BeforeAfter';
import { Odometer } from '../components/a/Odometer';

const KIN = 21; // 43.2s
const SHRINK = 76;
const ROLL = 80;
const OVER = 135; // 47.0s

export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const dim = prog(f, KIN - 4, 8) * (1 - prog(f, 62, 12));
  const punch = prog(f, KIN, 40, easeInOut);
  const scroll = lerp(40, 60, prog(f, 0, 60)) + prog(f, 120, 20, easeInOut) * 140;
  return (
    <AbsoluteFill>
      <ChatShell dim={dim * 0.85} scrollY={scroll}>
        <UserBubble text="Yes, remove them." enterAt={0} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18, alignItems: 'flex-start' }}>
          <ToolLine label="CLEO - Adjust the creator list" start={8} doneAt={22} />
          <ToolLine label="CLEO - What this campaign costs" start={16} doneAt={34} />
        </div>
        <Rise at={36} style={{ marginTop: 16 }}><ClaudeReply text="Done. Roster is 8, budget capped at Rs 1,50,000." start={38} wordGap={1.6} size={34} /></Rise>
        <div style={{ marginTop: 16 }}>
          <WidgetA activeTab="creators" compact tabCount={16} countNode={<Odometer from={16} to={8} start={ROLL} size={27} weight={600} color="inherit" />}>
            <RosterTiles shrinkAt={SHRINK} collapseAt={ROLL + 30} />
          </WidgetA>
        </div>
        <div style={{ marginTop: 22 }}><BeforeAfter at={112} overwriteAt={OVER} /></div>
      </ChatShell>
      {f >= KIN - 2 && f < 76 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(1, 1.4, punch)})` }}>
          <KineticText size={230} wordGap={6} exitAt={62} accentColor="#F0A24A" lines={[{ text: '16 to 8.', start: KIN, accent: ['8'] }]} />
        </AbsoluteFill>
      )}
      <Caption text="Cost and forecast follow." at={120} />
    </AbsoluteFill>
  );
};
