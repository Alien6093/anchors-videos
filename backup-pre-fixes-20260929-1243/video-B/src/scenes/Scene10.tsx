import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ChatShell, UserBubble, prog, lerp, C, FONT_SANS } from '../components';
import { Caption, Rise, ToolLine } from '../components/a/kit';
import { BriefPara } from '../components/a/Brief';
import { CREATORS } from '../lib/data';

const SWAP = 42; // 60.4s highlight ping

export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const p = CREATORS.find((c) => c.key === 'priyanshu')!;
  const ch = prog(f, SWAP, 8);
  const swapped = f >= SWAP;
  const D = 0.4;
  return (
    <AbsoluteFill>
      <ChatShell camera={{ x: lerp(40, -30, prog(f, 0, 90)), scale: 1.03, originX: 960, originY: 500 }}>
        <UserBubble text="Give Priyanshu a founder angle." enterAt={0} />
        <div style={{ marginTop: 16 }}><ToolLine label="CLEO - Edit a creator's brief" start={17} doneAt={38} /></div>
        <Rise at={26} style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Img src={staticFile(p.photo)} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
          <div style={{ fontFamily: FONT_SANS, fontSize: 36, fontWeight: 700, color: C.text }}>Priyanshu's brief</div>
        </Rise>
        <div style={{ marginTop: 18 }}>
          <BriefPara bodyDim={1} wordGap={0.4} line={{ label: 'Ask:', at: -20, dim: D, text: 'Publish one LinkedIn post on why structured interviews still end in gut decisions...' }} />
          <BriefPara bodyDim={1} wordGap={0.4} line={{ label: 'Key points to mention:', at: -20, dim: D, text: '' }} />
          <BriefPara bodyDim={1} wordGap={0.4} line={{ bullet: true, at: -20, dim: D, text: 'Zeko AI is an HRTech platform for Enterprise Workforce Intelligence...' }} />
          <BriefPara bodyDim={1} wordGap={0.4} line={{ bullet: true, at: -20, dim: D, text: 'It turns adaptive talent conversations into verified capability intelligence.' }} />
          <BriefPara key={swapped ? 'k3b' : 'k3a'} bodyDim={1} wordGap={0.5} line={{ bullet: true, at: swapped ? SWAP : -20, changed: ch, dim: swapped ? 1 : D, text: swapped ? 'Founders get evidence before the offer, not after.' : 'The goal is decisions that rest on evidence, not impressions.' }} />
          <BriefPara bodyDim={1} wordGap={0.4} line={{ label: 'Example angles:', at: -20, dim: D, text: '' }} />
          <BriefPara key={swapped ? 'a2' : 'a1'} bodyDim={1} wordGap={0.5} line={{ bullet: true, at: swapped ? SWAP + 6 : -20, changed: ch, dim: swapped ? 1 : D, text: swapped ? 'Angle - founder hiring: "I hired on a handshake. It cost me months."' : '"Structured interviews, unstructured decisions."' }} />
          <BriefPara bodyDim={1} wordGap={0.4} line={{ label: 'Avoid:', at: -20, dim: D, text: 'Press-release tone. Absolute claims. Competitor names.' }} />
        </div>
      </ChatShell>
      <Caption text="Same brief. Their own angle." at={12} />
    </AbsoluteFill>
  );
};
