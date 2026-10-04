import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT_SANS, easeInOut, lerp, prog } from '../components';
import { Caption, PAY_RECT } from '../components/a/kit';
import { PaymentPage } from '../components/a/PaymentPage';
import { Scene12 } from './Scene12';

const EXPAND = 21; // 0.7s
const WHIP = 135; // 74.5s
const SCENE12_FRAMES = 135; // scene 12 window (65.5-70.0s)

export const Scene13: React.FC = () => {
  const f = useCurrentFrame();
  const e = prog(f, 0, EXPAND, easeInOut);
  const w = prog(f, WHIP, 15, (t) => t * t * t);
  const R = PAY_RECT;
  const rect = { left: lerp(R.x, 0, e), top: lerp(R.y, 0, e), width: lerp(R.w, 1920, e), height: lerp(R.h, 1080, e), radius: lerp(20, 0, e) };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `translateX(${-w * 2100}px)`, filter: `blur(${w * 24}px)` }}>
        {f < 20 && (
          <AbsoluteFill style={{ opacity: 1 - prog(f, 0, 14) }}>
            <Sequence from={-SCENE12_FRAMES}><Scene12 /></Sequence>
          </AbsoluteFill>
        )}
        <div style={{ position: 'absolute', left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: rect.radius, overflow: 'hidden', background: '#FBF7F1' }}>
          <div style={{ position: 'absolute', left: -rect.left, top: -rect.top, width: 1920, height: 1080, opacity: prog(f, 12, 10) }}>
            <PaymentPage />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: C.orange, opacity: 1 - prog(f, 2, 16), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONT_SANS, fontWeight: 700, fontSize: 36 * lerp(1, 1.6, e) }}>
            <span style={{ opacity: 1 - prog(f, 0, 8), whiteSpace: 'nowrap' }}>Pay Rs 1,47,000 on anchors →</span>
          </div>
        </div>
        <Caption text="Pay once." bottom at={24} color="#1c1917" size={54} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
