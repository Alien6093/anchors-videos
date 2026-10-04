import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, COLUMN_W, COLUMN_X, FONT_SANS } from './theme';

export type Camera = { scale?: number; x?: number; y?: number; originX?: number; originY?: number };

type Props = {
  children?: React.ReactNode;
  title?: string;
  /** text shown in the input bar */
  inputText?: string;
  showCaret?: boolean;
  /** 0..1 orange-ish glow around input bar */
  inputGlow?: number;
  /** 0..1 dims + blurs chat behind kinetic text */
  dim?: number;
  camera?: Camera;
  scrollY?: number;
  /** 0..1 send button emphasis */
  sendPulse?: number;
  overlay?: React.ReactNode;
  background?: string;
};

const IconPlus = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);

export const ChatShell: React.FC<Props> = ({
  children, title = 'Zeko AI campaign', inputText = '', showCaret = false, inputGlow = 0, dim = 0,
  camera, scrollY = 0, sendPulse = 0, overlay, background = C.bg,
}) => {
  const cam = { scale: 1, x: 0, y: 0, originX: 960, originY: 540, ...camera };
  const hasText = inputText.length > 0;
  return (
    <AbsoluteFill style={{ background, overflow: 'hidden', fontFamily: FONT_SANS }}>
      <AbsoluteFill style={{
        transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
        transformOrigin: `${cam.originX}px ${cam.originY}px`,
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.68 * dim, filter: dim > 0.01 ? `blur(${dim * 7}px)` : undefined }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px' }}>
            <div style={{ color: C.text, fontSize: 28, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 14 }}>
              {title}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <div style={{ color: C.text, fontSize: 26, fontWeight: 500, background: C.bubble, borderRadius: 12, padding: '10px 22px' }}>Share</div>
          </div>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 80, height: 850, overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 46px, #000 calc(100% - 46px), transparent 100%)',
          }}>
            <div style={{ position: 'absolute', left: COLUMN_X, width: COLUMN_W, top: 20, transform: `translateY(${-scrollY}px)` }}>
              {children}
            </div>
          </div>
          <div style={{
            position: 'absolute', left: COLUMN_X, width: COLUMN_W, bottom: 44, minHeight: 100, borderRadius: 32,
            background: C.panel, border: `1.5px solid ${inputGlow > 0.02 ? `rgba(232,116,59,${0.35 + 0.5 * inputGlow})` : C.border}`,
            boxShadow: `0 0 ${60 * inputGlow}px rgba(232,116,59,${0.35 * inputGlow}), 0 10px 40px rgba(0,0,0,.35)`,
            display: 'flex', alignItems: 'flex-end', gap: 20, padding: '28px 26px', boxSizing: 'border-box',
          }}>
            <div style={{ paddingBottom: 2 }}><IconPlus /></div>
            <div style={{ flex: 1, fontSize: 32, lineHeight: 1.35, color: hasText ? C.text : C.muted, minHeight: 44, paddingBottom: 2 }}>
              {hasText ? inputText : 'Write a message...'}
              {showCaret && <span style={{ display: 'inline-block', width: 3, height: 34, background: C.orange, marginLeft: 3, verticalAlign: 'text-bottom' }} />}
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hasText ? C.orange : C.bubble, transform: `scale(${1 + 0.18 * sendPulse})`,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={hasText ? '#fff' : C.muted} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </div>
          </div>
        </div>
        {overlay}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
