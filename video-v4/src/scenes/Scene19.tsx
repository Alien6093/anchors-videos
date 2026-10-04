import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FakeCursor, FONT_SANS, ToolLabel, UserBubble } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftWidget } from '../components/b/DraftWidget';
import { Caption, DateChip, Scrim, Turn } from '../components/b/bits';
import { B_POSTS } from '../components/b/posts';
import { cre } from '../components/b/kit';
import { easeInOut, lerp, pop, prog, typedCount } from '../components/anim';

const NOTE = 'Name Zeko AI in the first two lines and add #ZekoAI. Keep the rest.';
const TYPE0 = 54;
const SEND = 108;

export const Scene19: React.FC = () => {
  const f = useCurrentFrame();
  const a = cre('ashish');
  const n = typedCount(NOTE.length, f, TYPE0, 40);
  const punch = 1 + 0.22 * prog(f, 50, 24, easeInOut) * (1 - prog(f, 104, 22, easeInOut));
  const composer = pop(f, 46, 14, 170);
  const items = [
    { label: 'Zeko AI not in first two lines', at: 24, ok: false },
    { label: '#ZekoAI missing', at: 28, ok: false },
  ];
  const sent = f >= SEND;
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn><UserBubble text={NOTE} enterAt={SEND} /></Turn>
        <Turn><ToolLabel name="CLEO - Send changes to a creator" start={SEND + 2} doneAt={SEND + 20} /></Turn>
      </ChatShell>
      <Scrim at={0} a={0.66} />
      <AbsoluteFill style={{ transform: `scale(${punch})`, transformOrigin: '1300px 520px' }}>
        <DraftWidget post={B_POSTS.ashish1} name={a.name} photo={a.photo} width={1000} showTags enterAt={4}
          badge={sent ? 'changes' : 'review'} badgeAt={SEND + 2} changeCount={sent ? 1 : 0} pressRequestAt={48}
          style={{ position: 'absolute', left: 60, top: 150, opacity: 1 }} />
        <ChecksPanel title="Against the brief" items={items} enterAt={16} style={{ position: 'absolute', left: 1110, top: 190 }} />
        <div style={{
          position: 'absolute', left: 1110, top: 470, width: 750, boxSizing: 'border-box', background: C.panel, border: `2px solid ${C.orange}`, borderRadius: 22, padding: '26px 32px', fontFamily: FONT_SANS,
          opacity: Math.min(1, composer * 2), transform: `translateY(${lerp(40, 0, composer)}px)`, boxShadow: '0 0 60px rgba(232,116,59,.25)',
        }}>
          <div style={{ fontSize: 26, color: C.muted, marginBottom: 12 }}>Request changes</div>
          <div style={{ fontSize: 38, lineHeight: 1.36, color: '#fff', minHeight: 140, fontWeight: 500 }}>
            {NOTE.slice(0, n)}{f < SEND && <span style={{ display: 'inline-block', width: 3, height: 38, background: C.orange, marginLeft: 3, verticalAlign: 'text-bottom' }} />}
          </div>
        </div>
        {sent && (
          <div style={{ position: 'absolute', left: 1110, top: 725, opacity: pop(f, SEND + 2, 12, 190), transform: `translateX(${lerp(40, 0, pop(f, SEND + 2, 12, 190))}px)`, fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: '#f5b25e', background: 'rgba(240,162,74,.17)', padding: '12px 26px', borderRadius: 14 }}>
            Changes requested · Change requests: 1 / 2
          </div>
        )}
      </AbsoluteFill>
      <FakeCursor keys={[{ f: 10, x: 1300, y: 820 }, { f: 44, x: 900, y: 872 }, { f: 80, x: 1400, y: 640 }, { f: SEND - 4, x: 1780, y: 690 }]} clicks={[48, SEND - 2]} />
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Say exactly why." at={14} />
    </AbsoluteFill>
  );
};
