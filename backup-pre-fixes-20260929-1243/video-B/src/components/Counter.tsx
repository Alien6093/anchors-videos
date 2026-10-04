import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fmtIN, prog } from './anim';

type Props = {
  value: number;
  start?: number;
  duration?: number;
  decimals?: number;
  indian?: boolean;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
};

export const Counter: React.FC<Props> = ({ value, start = 0, duration = 36, decimals = 0, indian = true, prefix = '', suffix = '', style }) => {
  const f = useCurrentFrame();
  const v = value * prog(f, start, duration);
  const text = decimals > 0 ? v.toFixed(decimals) : indian ? fmtIN(v) : String(Math.round(v));
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{text}{suffix}</span>;
};
