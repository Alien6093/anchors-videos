import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { typedCount } from '../lib/anim';
import { useS } from './layout';

/** "Request changes" note box with a typed message. */
export const NoteBox: React.FC<{ f: number; text: string; start: number; cps: number; minH: number; pauses?: { at: number; frames: number }[] }> = ({ f, text, start, cps, minH, pauses }) => {
  const s = useS();
  const n = typedCount(text.length, f, start, cps, pauses);
  const caret = Math.floor(f / 8) % 2 === 0 || n < text.length;
  return (
    <div style={{ borderRadius: s(28), border: `3px solid rgba(232,116,59,.55)`, background: 'rgba(232,116,59,.07)', padding: `${s(22)}px ${s(30)}px`, minHeight: s(minH), fontFamily: FONT_SANS }}>
      <div style={{ fontSize: s(42), color: C.muted, fontWeight: 600, marginBottom: s(6) }}>Request changes</div>
      <div style={{ fontSize: s(52), color: '#fff', fontWeight: 600, lineHeight: 1.28, letterSpacing: '-0.01em' }}>
        {text.slice(0, n)}
        <span style={{ display: 'inline-block', width: s(5), height: s(52), background: C.orange, marginLeft: s(4), verticalAlign: 'middle', opacity: caret ? 1 : 0 }} />
      </div>
    </div>
  );
};

export const AmberBadge: React.FC<{ f: number }> = ({ f }) => {
  const s = useS();
  const sc = Math.min(1, 0.6 + f * 0.1);
  return (
    <span style={{ display: 'inline-block', background: 'rgba(240,162,74,.22)', color: '#a85d00', border: '2px solid #F0A24A', fontWeight: 800, fontSize: s(40), borderRadius: 999, padding: `${s(6)}px ${s(20)}px`, whiteSpace: 'nowrap', transform: `scale(${sc})`, fontFamily: FONT_SANS }}>Changes requested</span>
  );
};
