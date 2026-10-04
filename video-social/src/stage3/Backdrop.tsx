import React from 'react';
import { AbsoluteFill } from 'remotion';
import { NEAR_BLACK } from './tokens';

/** Near-black ground with the soft orange radial glow used behind the teaser and the loop seam. */
export const glowBackground = (cyPct = 50, strength = 0.22): string =>
  `radial-gradient(ellipse 70% 45% at 50% ${cyPct}%, rgba(242,128,58,${strength}) 0%, rgba(242,128,58,${strength * 0.35}) 45%, rgba(10,10,10,0) 100%), ${NEAR_BLACK}`;

export const Backdrop: React.FC<{ cyPct?: number; strength?: number }> = ({ cyPct, strength }) => (
  <AbsoluteFill style={{ background: glowBackground(cyPct, strength) }} />
);
