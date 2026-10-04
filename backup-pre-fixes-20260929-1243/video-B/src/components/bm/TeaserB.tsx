import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { easeOut, fmtIN, lerp, prog } from '../anim';
import { ForecastBand } from './ForecastBand';

export const TEASER_LAND = 45;
const TARGET = 280000;

/** 0-1.6s hook: a blurred counter races up through the dim forecast band and lands at 2,80,000. */
export const TeaserB: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 2, TEASER_LAND - 2, easeOut);
  const value = TARGET * t;
  const blur = lerp(26, 0, prog(f, 4, TEASER_LAND - 6, (x) => x * x));
  const dolly = 1 + 0.16 * prog(f, 0, 48, (x) => x);
  const tick = prog(f, TEASER_LAND - 4, 8);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #241a18 0%, #0a0a0a 68%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${dolly})`, transformOrigin: '50% 55%' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 900, fontSize: 340, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums', filter: `blur(${blur}px)`, opacity: prog(f, 0, 5), textShadow: '0 0 90px rgba(251,247,241,.35)' }}>
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
