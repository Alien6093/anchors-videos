import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { AnchorsMark } from './AnchorsLogo';
import { prog, lerp } from './anim';

type Props = {
  name: string;
  start?: number;
  /** frame when spinner turns into check; undefined = spinner keeps spinning */
  doneAt?: number;
  style?: React.CSSProperties;
};

export const ToolLabel: React.FC<Props> = ({ name, start = 0, doneAt, style }) => {
  const f = useCurrentFrame();
  const a = prog(f, start, 8);
  const done = doneAt !== undefined && f >= doneAt;
  const check = doneAt === undefined ? 0 : prog(f, doneAt, 10);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 16, fontFamily: FONT_SANS, fontSize: 28, color: C.muted,
      border: `1.5px solid ${C.border}`, background: C.panel, borderRadius: 999, padding: '11px 26px 11px 18px',
      opacity: a, transform: `translateY(${lerp(14, 0, a)}px) scale(${lerp(0.94, 1, a)})`, ...style,
    }}>
      <AnchorsMark size={26} />
      <span>anchors</span>
      <span style={{ color: '#c9c7c1' }}>{name}</span>
      <span style={{ width: 28, height: 28, display: 'inline-block', marginLeft: 4 }}>
        {done ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - check)} />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2.8" strokeLinecap="round"
            style={{ transform: `rotate(${f * 18}deg)` }}>
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
        )}
      </span>
    </div>
  );
};
