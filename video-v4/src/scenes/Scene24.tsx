import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, ChatShell, Counter, FONT_SANS, KineticText, ToolLabel, UserBubble } from '../components';
import { CreatorTable, Tile } from '../components/b/Metrics';
import { Caption, Turn } from '../components/b/bits';
import { easeInOut, lerp, prog } from '../components/anim';

const NUM0 = 78;
const NUM_DUR = 51;
const TILES0 = 144;

export const Scene24: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = interpolate(f, [0, 200, 250], [-30, -30, 520], { extrapolateRight: 'clamp', easing: easeInOut });
  const dim = 0.7 * prog(f, 0, 6) * (1 - prog(f, 44, 12)) + 0.55 * prog(f, 62, 8) * (1 - prog(f, 136, 12));
  const big = prog(f, 64, 10) * (1 - prog(f, 134, 14));
  const cpmGlow = Math.sin(prog(f, 178, 50, (x) => x) * Math.PI);
  const shrink = prog(f, 134, 14);
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} dim={dim} camera={{ scale: 1 + f * 0.00012 }}>
        <Turn><UserBubble text="How is it performing?" enterAt={46} /></Turn>
        <Turn><ToolLabel name="CLEO - How the campaign is performing" start={58} doneAt={80} /></Turn>
        <div style={{ marginLeft: -100, width: 1300, marginBottom: 26 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Tile label="Impressions" at={TILES0}><Counter value={280000} start={0} duration={1} /></Tile>
            <Tile label="Likes" at={TILES0 + 6}><Counter value={4500} start={TILES0 + 6} duration={40} /></Tile>
            <Tile label="Comments" at={TILES0 + 12}><Counter value={361} start={TILES0 + 12} duration={40} /></Tile>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Tile label="Engagement rate" at={TILES0 + 18} flex={1}><Counter value={1.74} start={TILES0 + 18} duration={40} decimals={2} suffix="%" /></Tile>
            <Tile label="Effective CPM" at={TILES0 + 26} flex={1.2} glow={cpmGlow} sub="plan Rs 540">Rs <Counter value={525} start={TILES0 + 26} duration={40} /></Tile>
            <Tile label="Budget used" at={TILES0 + 34} flex={1.7} bar={prog(f, TILES0 + 40, 40)} sub="of Rs 1,50,000">Rs <Counter value={147000} start={TILES0 + 34} duration={44} /></Tile>
          </div>
        </div>
        <Turn><ToolLabel name="CLEO - How each creator performed" start={206} doneAt={226} /></Turn>
        <div style={{ marginLeft: -100 }}><CreatorTable start={216} dimAt={262} lockAt={330} /></div>
        <div style={{ marginTop: 16, marginLeft: -100, fontFamily: FONT_SANS, fontSize: 26, color: C.muted, opacity: prog(f, 334, 10) }}>Data as of Fri 23 Oct 2026</div>
      </ChatShell>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: big, transform: `scale(${lerp(1.08, 1, prog(f, 64, 20)) - 0.55 * shrink}) translateY(${-shrink * 120}px)`, pointerEvents: 'none' }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 40, color: C.muted, fontWeight: 500, marginBottom: 6 }}>Impressions</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 320, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, textShadow: '0 10px 80px rgba(0,0,0,.6)', fontVariantNumeric: 'tabular-nums' }}>
          <Counter value={280000} start={NUM0} duration={NUM_DUR} />
        </div>
      </AbsoluteFill>
      {f < 50 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
          <KineticText size={150} wordGap={6} exitAt={38} lines={[{ text: 'Two weeks later.', start: 2 }]} />
          <div style={{ opacity: prog(f, 18, 8) * (1 - prog(f, 38, 12)), fontFamily: FONT_SANS, fontSize: 40, fontWeight: 700, color: C.ink, background: C.cream, padding: '12px 30px', borderRadius: 16 }}>Fri 23 Oct 2026</div>
        </AbsoluteFill>
      )}
      <Caption text="Eight posts. All measured." at={50} out={200} />
    </AbsoluteFill>
  );
};
