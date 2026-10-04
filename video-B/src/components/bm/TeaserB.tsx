import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { fmtIN, lerp, prog } from '../anim';
import { ForecastBand } from './ForecastBand';

export const TEASER_LAND = 45;
const TARGET = 280000;
const BLUR_FROM = 16; // px at f0; clears linearly by f30
const BLUR_CLEAR = 30;
const COUNT_EASE = Easing.bezier(0.4, 0, 0.2, 1); // milder than easeOut: no one-frame jump

/** 0-1.6s hook: a blurred counter races up through the dim forecast band and lands at 2,80,000. */
export const TeaserB: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 0, TEASER_LAND, COUNT_EASE);
  const value = TARGET * t;
  const blur = lerp(BLUR_FROM, 0, prog(f, 0, BLUR_CLEAR, Easing.linear));
  const dolly = 1 + 0.16 * prog(f, 0, 48, (x) => x);
  const tick = prog(f, TEASER_LAND - 4, 8);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #241a18 0%, #0a0a0a 68%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${dolly})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 900, fontSize: 340, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums', filter: `blur(${blur}px)`, textShadow: '0 0 90px rgba(251,247,241,.35)' }}>
          {fmtIN(value)}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 600, fontSize: 40, color: C.muted, opacity: prog(f, 30, 8) }}>impressions</div>
        <div style={{ position: 'absolute', left: 210, top: 700, filter: `blur(${blur * 0.25}px)` }}>
          <ForecastBand variant="dark" width={1500} value={value} bandOpacity={0.55} tickOpacity={0.4} tick={tick} valueLabel={false} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
