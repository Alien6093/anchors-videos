import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { SA05 } from './SA05';
import { C, FONT_SANS, easeInOut, lerp, prog } from '../components';
import { Caption } from '../components/a/kit';
import { PaymentPageA } from '../components/a/PaymentPageA';
import { PAY_LABEL, PAY_RECT } from '../lib/consts';

const EXPAND = 21;
const WHIP = 65; // reverse whip 19.286s

export const SA06: React.FC = () => {
  const f = useCurrentFrame();
  const e = prog(f, 0, EXPAND, easeInOut);
  const w = prog(f, WHIP, 16, (t) => t * t * t);
  const R = PAY_RECT;
  // grows from the button centre: half-extents reach the far frame edge on each axis
  const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
  const hw = lerp(R.w / 2, Math.max(cx, 1920 - cx), e), hh = lerp(R.h / 2, Math.max(cy, 1080 - cy), e);
  const rect = { left: cx - hw, top: cy - hh, width: hw * 2, height: hh * 2, radius: lerp(20, 0, e) };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `translateX(${-w * 2100}px)`, filter: w > 0 ? `blur(${w * 24}px)` : undefined }}>
        {f < 16 && (
          <AbsoluteFill style={{ opacity: 1 - prog(f, 0, 12) }}>
            <Sequence from={-64}><SA05 /></Sequence>
          </AbsoluteFill>
        )}
        <div style={{ position: 'absolute', left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: rect.radius, overflow: 'hidden', background: '#FBF7F1' }}>
          <div style={{ position: 'absolute', left: -rect.left, top: -rect.top, width: 1920, height: 1080, opacity: prog(f, 10, 10) }}>
            <PaymentPageA checkAt={16} amountAt={24} chipAt={42} lineAt={50} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: C.orange, opacity: 1 - prog(f, 9, 11), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONT_SANS, fontWeight: 700, fontSize: 36 * lerp(1, 1.6, e) }}>
            <span style={{ opacity: 1 - prog(f, 0, 8), whiteSpace: 'nowrap' }}>{PAY_LABEL}</span>
          </div>
        </div>
        <Caption text="Pay once." bottom at={26} color="#1c1917" size={54} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
