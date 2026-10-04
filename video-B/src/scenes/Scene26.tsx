import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, ToolLabel, UserBubble } from '../components';
import { AudiencePanel, ModeToggle, PANELS } from '../components/b/Audience';
import { Caption } from '../components/b/bits';
import { easeInOut, lerp, prog } from '../components/anim';

export const Scene26: React.FC = () => {
  const f = useCurrentFrame();
  const mode = interpolate(f, [0, 105, 125, 145, 165], [0, 0, 1, 1, 2], { extrapolateRight: 'clamp', easing: easeInOut });
  const pan = lerp(24, -24, prog(f, 0, 225, (t) => t));
  const note = prog(f, 172, 12);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-20}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ flex: 1 }}><UserBubble text="Who did it reach?" enterAt={0} style={{ justifyContent: 'flex-start' }} /></div>
          <ToolLabel name="CLEO - Who it reached" start={8} doneAt={22} style={{ whiteSpace: 'nowrap', fontSize: 26 }} />
        </div>
      </ChatShell>
      <AbsoluteFill style={{ transform: `translateX(${pan}px)` }}>
        <div style={{ position: 'absolute', left: 62, top: 250 }}><ModeToggle mode={mode} at={20} /></div>
        <div style={{ position: 'absolute', left: 62, top: 340, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {PANELS.map((p, i) => (
            <AudiencePanel key={p.title} panel={p} mode={mode} enterAt={14 + i * 8} emphasis={i === 0 ? 1 : 0.36} width={i === 0 ? 540 : 380} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 62, top: 850, fontFamily: FONT_SANS, fontSize: 34, color: '#fff', opacity: note, transform: `translateY(${lerp(20, 0, note)}px)` }}>
          <b style={{ color: C.cream }}>Commenters skew HR Manager / Talent Acquisition: 47%</b> <span style={{ color: C.muted }}>(Likers 38%)</span>
        </div>
      </AbsoluteFill>
      <Caption text="Right people. Right roles." at={12} />
    </AbsoluteFill>
  );
};
