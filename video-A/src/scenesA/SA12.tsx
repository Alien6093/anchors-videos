import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, FakeCursor, FONT_SANS, ToolLabel, UserBubble, easeInOut, lerp, pop, prog, typedCount } from '../components';
import { ChecksPanel } from '../components/b/ChecksPanel';
import { DraftCardA } from '../components/a/DraftCardA';
import { Caption, DateChip, Scrim, Turn } from '../components/b/bits';
import { B_POSTS } from '../components/b/posts';
import { cre } from '../components/b/kit';

const NOTE = 'Name Zeko AI in the first two lines and add #ZekoAI. Keep the rest.';
const CROSS_1 = 16; // beat 69
const CROSS_2 = 32; // beat 70
const CLICK = 48; // beat 71 (Request changes)
const SEND = 112; // beat 75
const BADGE = 128; // beat 76

export const SA12: React.FC = () => {
  const f = useCurrentFrame();
  const a = cre('ashish');
  const n = typedCount(NOTE.length, f, CLICK + 6, 36);
  const punch = 1 + 0.35 * prog(f, 52, 40, easeInOut) * (1 - prog(f, 132, 20, easeInOut));
  const composer = pop(f, CLICK - 2, 14, 170);
  const items = [
    { label: 'Zeko AI not in first two lines', at: CROSS_1, ok: false },
    { label: '#ZekoAI missing', at: CROSS_2, ok: false },
  ];
  const sent = f >= SEND;
  const bp = pop(f, BADGE, 12, 190);
  const dim = lerp(1, 0.55, prog(f, CLICK, 12));
  const shift = -285 * ((punch - 1) / 0.35);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-30}>
        <Turn><UserBubble text={NOTE} enterAt={SEND} /></Turn>
        <Turn><ToolLabel name="CLEO - Send changes to a creator" start={SEND + 1} doneAt={SEND + 16} /></Turn>
      </ChatShell>
      <Scrim at={0} a={0.66} />
      <AbsoluteFill style={{ transform: `translate(${shift}px, ${70 * ((punch - 1) / 0.35)}px) scale(${punch})`, transformOrigin: '1485px 600px' }}>
        <div style={{ position: 'absolute', left: 60, top: 150, filter: `brightness(${dim})` }}>
          <DraftCardA post={B_POSTS.ashish1} name={a.name} photo={a.photo} width={1000} showTags enterAt={4}
            badge={f >= BADGE ? 'changes' : 'review'} badgeAt={BADGE} changeCount={f >= BADGE ? 1 : 0} pressRequestAt={CLICK} />
        </div>
        <ChecksPanel title="Claude's check against the brief" items={items} enterAt={8} style={{ position: 'absolute', left: 1110, top: 190, filter: `brightness(${dim})` }} />
        <div style={{
          position: 'absolute', left: 1110, top: 470, width: 750, boxSizing: 'border-box', background: C.panel, border: `2px solid ${C.orange}`, borderRadius: 22, padding: '26px 32px', fontFamily: FONT_SANS,
          opacity: Math.min(1, composer * 2), transform: `translateY(${lerp(40, 0, composer)}px)`, boxShadow: '0 0 60px rgba(232,116,59,.25)',
        }}>
          <div style={{ fontSize: 26, color: C.muted, marginBottom: 12 }}>Request changes</div>
          <div style={{ fontSize: 38, lineHeight: 1.36, color: '#fff', minHeight: 140, fontWeight: 500 }}>
            {NOTE.slice(0, n)}{f < SEND && <span style={{ display: 'inline-block', width: 3, height: 38, background: C.orange, marginLeft: 3, verticalAlign: 'text-bottom' }} />}
          </div>
        </div>
        {f >= BADGE && (
          <div style={{ position: 'absolute', left: 1110, top: 725, opacity: Math.min(1, bp * 2), transform: `translateX(${lerp(40, 0, Math.min(1, bp))}px)`, fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: '#f5b25e', background: 'rgba(240,162,74,.17)', padding: '12px 26px', borderRadius: 14 }}>
            Changes requested · Change requests: 1 / 2
          </div>
        )}
      </AbsoluteFill>
      <FakeCursor keys={[{ f: 10, x: 1300, y: 820 }, { f: CLICK - 2, x: 900, y: 872 }, { f: 84, x: 1400, y: 640 }, { f: SEND - 4, x: 1780, y: 700 }]} clicks={[CLICK]} />
      <DateChip label="Mon 5 Oct" at={-20} />
      <Caption text="Say exactly why." at={17} />
    </AbsoluteFill>
  );
};
