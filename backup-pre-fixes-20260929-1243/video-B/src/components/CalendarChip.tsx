import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { lerp, pop } from './anim';

type Props = { label?: string; enterAt?: number; style?: React.CSSProperties };

export const CalendarChip: React.FC<Props> = ({ label = 'Tue, 6 Oct · 10:00 AM', enterAt = 0, style }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 9, 220, 0.6);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 16, background: C.cream, color: C.ink, fontFamily: FONT_SANS, fontSize: 30, fontWeight: 600,
      padding: '14px 26px 14px 16px', borderRadius: 18, boxShadow: '0 20px 50px rgba(0,0,0,.5)', opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.3, 1, p)}) rotate(${lerp(-8, 0, p)}deg)`, ...style,
    }}>
      <div style={{ width: 54, height: 58, borderRadius: 10, background: '#fff', border: `2px solid ${C.creamLine}`, overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ background: C.red, height: 16 }} />
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: '38px' }}>6</div>
      </div>
      {label}
    </div>
  );
};
