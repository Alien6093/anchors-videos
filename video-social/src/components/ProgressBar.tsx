import React from 'react';
import { FORMATS, Format } from '../lib/format';
import { C } from './theme';

const BAR_H = 8;

type Props = { format: Format; frame: number; totalFrames: number };

export const ProgressBar: React.FC<Props> = ({ format, frame, totalFrames }) => {
  const spec = FORMATS[format];
  const top = format === '45' ? spec.safe.top - 30 : spec.progressTop;
  const w = spec.width - spec.safe.side * 2;
  const pct = Math.min(1, frame / Math.max(1, totalFrames - 1));
  return (
    <div style={{ position: 'absolute', left: spec.safe.side, top, width: w, height: BAR_H, borderRadius: BAR_H, background: 'rgba(255,255,255,.22)' }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: BAR_H, background: C.orange, boxShadow: `0 0 18px ${C.orange}` }} />
    </div>
  );
};
