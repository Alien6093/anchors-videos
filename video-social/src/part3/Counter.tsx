import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { fmtIN, lerp, prog } from '../lib/anim';

/** Native count: FINAL value is `to`; ramps once over [start, start+dur] and holds. */
export const countValue = (f: number, from: number, to: number, start: number, dur: number): number =>
  Math.round(lerp(from, to, prog(f, start, dur)));

type Props = {
  value: string;
  label: string;
  top: number;
  height: number;
  valueSize: number;
  labelSize: number;
  /** 0 = bare hero, 1 = full tile chrome */
  tile: number;
  scale?: number;
  glow?: number;
};

/** One Impressions object that is both the hero counter and the first tile (no crossfade, no second copy). */
export const HeroTile: React.FC<Props> = ({ value, label, top, height, valueSize, labelSize, tile, scale = 1, glow = 0 }) => (
  <div style={{
    position: 'absolute', top, left: 0, right: 0, height, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS,
    background: `rgba(38,38,36,${tile})`, border: `2px solid rgba(61,60,57,${tile})`, borderRadius: 28, transform: `scale(${scale})`,
  }}>
    {glow > 0 && <div style={{ position: 'absolute', inset: -90, borderRadius: 200, background: `radial-gradient(ellipse at 50% 55%, rgba(232,116,59,${0.5 * glow}) 0%, rgba(232,116,59,0) 66%)`, zIndex: 0 }} />}
    <div style={{ fontSize: labelSize, color: C.muted, fontWeight: 600, lineHeight: 1.1, zIndex: 1 }}>{label}</div>
    <div style={{ fontSize: valueSize, color: '#fff', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums', zIndex: 1, textShadow: glow > 0 ? `0 0 ${50 * glow}px rgba(232,116,59,${0.55 * glow})` : undefined }}>{value}</div>
  </div>
);

export { fmtIN };
