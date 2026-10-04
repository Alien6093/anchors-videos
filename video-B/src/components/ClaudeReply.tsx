import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SERIF } from './theme';
import { prog } from './anim';

type Props = {
  text: string;
  start?: number;
  /** frames between words */
  wordGap?: number;
  size?: number;
  style?: React.CSSProperties;
};

/** Serif reply, words stream in. `**bold**` supported. */
export const ClaudeReply: React.FC<Props> = ({ text, start = 0, wordGap = 2.2, size = 36, style }) => {
  const f = useCurrentFrame();
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  let idx = 0;
  return (
    <div style={{ fontFamily: FONT_SERIF, fontSize: size, lineHeight: 1.5, color: C.text, padding: '0 6px', ...style }}>
      {parts.flatMap((part, pi) => {
        const bold = part.startsWith('**');
        const words = (bold ? part.slice(2, -2) : part).split(/(\s+)/);
        return words.map((w, wi) => {
          if (/^\s+$/.test(w) || w === '') return <span key={`${pi}-${wi}`}>{w}</span>;
          const o = prog(f, start + idx++ * wordGap, 5);
          return <span key={`${pi}-${wi}`} style={{ opacity: o, fontWeight: bold ? 600 : 400 }}>{w}</span>;
        });
      })}
    </div>
  );
};
