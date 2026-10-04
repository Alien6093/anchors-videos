import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { pop, prog, easeInOut, lerp } from './anim';

export type KLine = { text: string; start: number; accent?: string[] };

type Props = {
  lines: KLine[];
  size?: number;
  wordGap?: number;
  /** scale each word pops in from (settles to 1) */
  startScale?: number;
  /** frame at which the whole block slides up and out */
  exitAt?: number;
  /** frame of a final pulse on the last word */
  pulseAt?: number;
  accentColor?: string;
  align?: 'center' | 'left';
  style?: React.CSSProperties;
};

const strip = (w: string) => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

export const KineticText: React.FC<Props> = ({
  lines, size = 120, wordGap = 9, startScale = 1.55, exitAt, pulseAt, accentColor = C.orange, align = 'center', style,
}) => {
  const f = useCurrentFrame();
  const exit = exitAt === undefined ? 0 : prog(f, exitAt, 12, easeInOut);
  const lastLine = lines[lines.length - 1];
  const lastIdx = lastLine.text.split(' ').length - 1;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start',
      transform: `translateY(${-exit * 160}px)`, opacity: 1 - exit, ...style,
    }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          {ln.text.split(' ').map((w, wi, arr) => {
            const at = ln.start + wi * wordGap;
            const p = pop(f, at, 13, 260, 0.6);
            const o = prog(f, at, 3);
            const isLast = li === lines.length - 1 && wi === lastIdx;
            const pulse = isLast && pulseAt !== undefined ? 1 + 0.06 * Math.sin(prog(f, pulseAt, 12, (t) => t) * Math.PI) : 1;
            const accent = ln.accent?.map(strip).includes(strip(w));
            return (
              <span key={wi} style={{
                display: 'inline-block', fontFamily: FONT_SANS, fontWeight: 900, fontSize: size, lineHeight: 1.08,
                letterSpacing: '-0.045em', color: accent ? accentColor : '#fff',
                marginRight: wi < arr.length - 1 ? size * 0.24 : 0,
                opacity: o, transform: `translateY(${lerp(36, 0, Math.min(1, p))}px) scale(${lerp(startScale, 1, p) * pulse})`,
                textShadow: '0 6px 50px rgba(0,0,0,0.55)',
              }}>{w}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
