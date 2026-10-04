import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { pop, lerp } from './anim';

type Props = {
  text: string;
  enterAt?: number;
  /** show only this many chars (typing) */
  chars?: number;
  style?: React.CSSProperties;
};

export const UserBubble: React.FC<Props> = ({ text, enterAt = 0, chars, style }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 170);
  const shown = chars === undefined ? text : text.slice(0, chars);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: Math.min(1, p * 1.6), transform: `translateY(${lerp(50, 0, p)}px)`, ...style }}>
      <div style={{
        background: C.bubble, color: C.text, fontFamily: FONT_SANS, fontSize: 32, lineHeight: 1.4,
        padding: '22px 30px', borderRadius: 22, maxWidth: 860,
      }}>{shown}</div>
    </div>
  );
};
