import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fmtIN, lerp, prog } from '../anim';

type Props = { from: number; to: number; start: number; duration: number; decimals?: number; suffix?: string; prefix?: string; ease?: (t: number) => number };

/** Tabular counter that climbs from `from` to `to` (Indian grouping). */
export const CountFromTo: React.FC<Props> = ({ from, to, start, duration, decimals = 0, suffix = '', prefix = '', ease }) => {
  const f = useCurrentFrame();
  const v = lerp(from, to, prog(f, start, duration, ease));
  const text = decimals > 0 ? v.toFixed(decimals) : fmtIN(v);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{prefix}{text}{suffix}</span>;
};
