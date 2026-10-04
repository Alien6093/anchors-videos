import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { AnchorsMark } from '../AnchorsLogo';
import { lerp, pop, prog } from '../anim';

export const DIM = 0.35;
/** canvas position of chat content origin (scrollY 0) */
export const CHAT_X = 410;
export const CHAT_Y = 100;

type CaptionProps = { text: string; at?: number; outAt?: number; size?: number; color?: string; left?: number; top?: number; width?: number; bottom?: boolean };

/** Margin caption: words pop in one by one. Lives in the left margin (x<356), never over UI. */
export const Caption: React.FC<CaptionProps> = ({ text, at = 6, outAt, size = 58, color = '#fff', left = 28, top = 380, width = 340, bottom }) => {
  const f = useCurrentFrame();
  const out = outAt === undefined ? 0 : prog(f, outAt, 8);
  const words = text.split(' ');
  return (
    <div style={{
      position: 'absolute', left: bottom ? 0 : left, top: bottom ? undefined : top, bottom: bottom ? 46 : undefined, width: bottom ? '100%' : width, textAlign: bottom ? 'center' : 'left',
      fontFamily: FONT_SANS, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.035em', color, opacity: 1 - out, pointerEvents: 'none',
    }}>
      {words.map((w, i) => {
        const p = pop(f, at + i * 3, 14, 200, 0.6);
        return <span key={i} style={{ display: 'inline-block', marginRight: '0.24em', opacity: Math.min(1, p * 2), transform: `translateY(${lerp(24, 0, Math.min(1, p))}px)` }}>{w}</span>;
      })}
    </div>
  );
};

type ChipProps = { label: string; enterAt?: number; sel?: number; dim?: number; size?: number; style?: React.CSSProperties; pulse?: number };

/** Dark-chat option chip. sel 0..1 = neutral cream highlight (never orange). */
export const Chip: React.FC<ChipProps> = ({ label, enterAt = 0, sel = 0, dim = 0, size = 27, style, pulse = 0 }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 190);
  const bg = sel > 0 ? `rgba(243,233,220,${sel})` : C.panel;
  return (
    <div style={{
      fontFamily: FONT_SANS, fontSize: size, fontWeight: sel > 0.5 ? 600 : 400, color: sel > 0.5 ? C.ink : C.text,
      background: sel > 0 ? bg : C.panel, border: `1.5px solid ${sel > 0.5 ? '#F3E9DC' : C.border}`, borderRadius: 999, padding: '13px 26px',
      opacity: Math.min(1, p * 1.8) * lerp(1, DIM, dim), transform: `translateY(${lerp(20, 0, Math.min(1, p))}px) scale(${1 + 0.06 * pulse})`, whiteSpace: 'nowrap', ...style,
    }}>{label}</div>
  );
};

export const ChipRow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, ...style }}>{children}</div>
);

export const GroupLabel: React.FC<{ text: string; enterAt?: number; dim?: number }> = ({ text, enterAt = 0, dim = 0 }) => {
  const f = useCurrentFrame();
  return <div style={{ fontFamily: FONT_SANS, fontSize: 26, fontWeight: 600, color: C.muted, margin: '26px 0 14px', opacity: prog(f, enterAt, 8) * lerp(1, DIM, dim) }}>{text}</div>;
};

type ToolProps = { label: string; start?: number; doneAt?: number; chip?: string; dim?: number; style?: React.CSSProperties };

/** grey collapsed tool line: mark + label, spinner -> check, optional right chip */
export const ToolLine: React.FC<ToolProps> = ({ label, start = 0, doneAt, chip, dim = 0, style }) => {
  const f = useCurrentFrame();
  const a = prog(f, start, 8);
  const done = doneAt !== undefined && f >= doneAt;
  const ck = doneAt === undefined ? 0 : prog(f, doneAt, 10);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 16, fontFamily: FONT_SANS, fontSize: 28, color: '#c9c7c1',
      border: `1.5px solid ${C.border}`, background: C.panel, borderRadius: 999, padding: '11px 26px 11px 18px',
      opacity: a * lerp(1, DIM, dim), transform: `translateY(${lerp(14, 0, a)}px)`, ...style,
    }}>
      <AnchorsMark size={26} />
      <span>{label}</span>
      {chip && <span style={{ background: C.bubble, color: C.text, borderRadius: 999, padding: '4px 16px', fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>{chip}</span>}
      <span style={{ width: 28, height: 28, display: 'inline-block' }}>
        {done ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - ck)} />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2.8" strokeLinecap="round" style={{ transform: `rotate(${f * 18}deg)` }}>
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
        )}
      </span>
    </div>
  );
};

/** wrapper that fades a block in and can dim it */
export const Rise: React.FC<{ at: number; dim?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({ at, dim = 0, children, style, dist = 30 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  return <div style={{ opacity: p * lerp(1, DIM, dim), transform: `translateY(${lerp(dist, 0, p)}px)`, ...style }}>{children}</div>;
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** canvas rect of the pay chip at the end of scene 12 (shared element into scene 13) */
export const PAY_RECT = { x: 410, y: 648, w: 614, h: 88 };
