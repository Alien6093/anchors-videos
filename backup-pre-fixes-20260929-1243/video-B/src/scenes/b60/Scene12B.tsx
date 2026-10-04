import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, ToolLabel, UserBubble } from '../../components';
import { AudiencePanel, ModeToggle, PANELS } from '../../components/b/Audience';
import { Caption } from '../../components/b/bits';
import { easeInOut, lerp, prog } from '../../components/anim';

const LIKERS = 80;
const COMMENTERS = 128;
const SKEW = 159;

export const Scene12B: React.FC = () => {
  const f = useCurrentFrame();
  const mode = interpolate(f, [0, LIKERS, LIKERS + 14, COMMENTERS, COMMENTERS + 14], [0, 0, 1, 1, 2], { extrapolateRight: 'clamp', easing: easeInOut });
  const pan = lerp(40, -40, prog(f, 0, 192, (t) => t));
  const note = prog(f, SKEW, 12);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-100}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ flex: 1 }}><UserBubble text="Who did it reach?" enterAt={0} style={{ justifyContent: 'flex-start' }} /></div>
          <ToolLabel name="CLEO - Who it reached" start={8} doneAt={22} style={{ whiteSpace: 'nowrap', fontSize: 26 }} />
        </div>
      </ChatShell>
      <AbsoluteFill style={{ transform: `translateX(${pan}px)` }}>
        <div style={{ position: 'absolute', left: 90, top: 296 }}><ModeToggle mode={mode} at={20} /></div>
        <div style={{ position: 'absolute', left: 90, top: 376, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {PANELS.map((p, i) => (
            <AudiencePanel key={p.title} panel={p} mode={mode} enterAt={14 + i * 8} emphasis={i === 0 ? 1 : 0.36} width={i === 0 ? 540 : 380} rowH={56} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 90, top: 850, fontFamily: FONT_SANS, fontSize: 34, color: '#fff', opacity: note, transform: `translateY(${lerp(20, 0, note)}px)` }}>
          <b style={{ color: C.cream }}>Commenters skew HR Manager / Talent Acquisition: 47%</b> <span style={{ color: C.muted }}>(Likers 38%)</span>
        </div>
      </AbsoluteFill>
      <Caption text="Right people. Right roles." at={21} out={117} />
    </AbsoluteFill>
  );
};
