import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SERIF } from '../theme';
import { prog } from '../anim';

export type BriefLine = { label?: string; text: string; at: number; bullet?: boolean; changed?: number; dim?: number };

const CREAM = '#F3E9DC';

/** One brief paragraph: bold label flashes cream at `at`, body words stream in dimmed (texture). */
export const BriefPara: React.FC<{ line: BriefLine; size?: number; bodyDim?: number; wordGap?: number }> = ({ line, size = 31, bodyDim = 0.5, wordGap = 1.5 }) => {
  const f = useCurrentFrame();
  const { label, text, at, bullet } = line;
  const flash = label ? prog(f, at, 4) * (1 - prog(f, at + 6, 14)) : 0;
  const labelOn = label ? prog(f, at, 5) : 0;
  const words = text.split(' ');
  const ch = line.changed ?? 0;
  return (
    <div style={{ fontFamily: FONT_SERIF, fontSize: size, lineHeight: 1.46, color: C.text, paddingLeft: bullet ? 34 : 0, position: 'relative', marginBottom: 8, opacity: line.dim === undefined ? 1 : line.dim }}>
      {bullet && <span style={{ position: 'absolute', left: 10, opacity: prog(f, at, 6) }}>•</span>}
      {label && (
        <span style={{ fontWeight: 600, opacity: labelOn, background: `rgba(243,233,220,${flash * 0.9})`, color: flash > 0.3 ? C.ink : C.text, borderRadius: 6, padding: '0 6px', marginLeft: -6, marginRight: 8 }}>{label}</span>
      )}
      <span style={{ background: `rgba(243,233,220,${0.16 * ch})`, boxShadow: ch > 0 ? `0 0 ${30 * ch}px rgba(243,233,220,${0.25 * ch})` : undefined, borderRadius: 6, color: ch > 0 ? '#fff' : undefined }}>
        {words.map((w, i) => (
          <span key={i} style={{ opacity: prog(f, at + 4 + i * wordGap, 4) * (ch > 0 ? 1 : bodyDim + 0.0) }}>{w} </span>
        ))}
      </span>
      <span style={{ display: 'none' }}>{CREAM}</span>
    </div>
  );
};
