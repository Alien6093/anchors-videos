import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, ChatShell, FONT_SANS, UserBubble, easeInOut, lerp, prog } from '../components';
import { Rise, ToolLine } from '../components/a/kit';
import { Caption } from '../components/b/bits';
import { BriefPara } from '../components/a/Brief';
import { cre } from '../components/b/kit';

const TOOL_AT = 5; // 10.9s
const ANGLE_AT = 21; // 11.43s
const KP3_AT = 64; // beat 24 (12.857s)
const D = 0.35;

export const SA04: React.FC = () => {
  const f = useCurrentFrame();
  const p = cre('priyanshu');
  const angle = prog(f, ANGLE_AT, 8);
  const kp3 = prog(f, KP3_AT, 8);
  const aOn = f >= ANGLE_AT;
  const kOn = f >= KP3_AT;
  const punch = lerp(1, 1.3, prog(f, 11, 55, easeInOut));
  const oy = lerp(520, 640, prog(f, 11, 55, easeInOut));
  const base = { bodyDim: 1, wordGap: 0.4 } as const;
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale: punch, originX: 960, originY: oy, x: 150 * prog(f, 11, 55, easeInOut) }} inputGlow={0.1}>
        <UserBubble text="Give Priyanshu a founder angle." enterAt={0} />
        <div style={{ marginTop: 16 }}><ToolLine label="CLEO - Edit a creator's brief" start={TOOL_AT} doneAt={TOOL_AT + 12} dim={0.35 * prog(f, ANGLE_AT, 8)} /></div>
        <Rise at={9} style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16 }} dim={1}>
          <Img src={staticFile(p.photo)} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, color: C.text }}>Priyanshu's brief</div>
        </Rise>
        <div style={{ marginTop: 18 }}>
          <BriefPara {...base} line={{ label: 'Ask:', at: -20, dim: D, text: 'Publish one LinkedIn post on why structured interviews still end in gut decisions...' }} />
          <BriefPara {...base} line={{ label: 'Key points to mention:', at: -20, dim: D, text: '' }} />
          <BriefPara {...base} line={{ bullet: true, at: -20, dim: D, text: 'Zeko AI is an HRTech platform for Enterprise Workforce Intelligence...' }} />
          <BriefPara {...base} line={{ bullet: true, at: -20, dim: D, text: 'It turns adaptive talent conversations into verified capability intelligence.' }} />
          <BriefPara key={kOn ? 'k3b' : 'k3a'} {...base} wordGap={0.5} line={{ bullet: true, at: kOn ? KP3_AT : -20, changed: kp3, dim: kOn ? 0.8 : D, text: kOn ? 'Founders get evidence before the offer, not after.' : 'The goal is decisions that rest on evidence, not impressions.' }} />
          <BriefPara {...base} line={{ label: 'Example angles:', at: -20, dim: D, text: '' }} />
          <BriefPara key={aOn ? 'a2' : 'a1'} {...base} wordGap={0.5} line={{ bullet: true, at: aOn ? ANGLE_AT : -20, changed: angle, dim: aOn ? 1 : D, text: aOn ? 'Angle - founder hiring: "I hired on a handshake. It cost me months."' : '"Structured interviews, unstructured decisions."' }} />
          <BriefPara {...base} line={{ label: 'Avoid:', at: -20, dim: D, text: 'Press-release tone. Absolute claims. Competitor names.' }} />
        </div>
      </ChatShell>
      <Caption text="Same brief. Their own angle." at={12} />
    </AbsoluteFill>
  );
};
