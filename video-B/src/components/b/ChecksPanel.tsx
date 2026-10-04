import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { prog } from '../anim';
import { Cross, Tick } from './bits';

export type CheckItem = { label: string; at: number; ok?: boolean };

export const ChecksPanel: React.FC<{ title?: string; items: CheckItem[]; width?: number; size?: number; enterAt?: number; style?: React.CSSProperties }> = ({
  title = 'Against the brief', items, width = 750, size = 36, enterAt = 0, style,
}) => {
  const f = useCurrentFrame();
  const e = prog(f, enterAt, 12);
  return (
    <div style={{
      width, boxSizing: 'border-box', background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: '30px 36px 26px',
      fontFamily: FONT_SANS, opacity: e, transform: `translateX(${(1 - e) * 60}px)`, boxShadow: '0 30px 70px rgba(0,0,0,.4)', ...style,
    }}>
      <div style={{ fontSize: 28, color: C.muted, marginBottom: 18, fontWeight: 500 }}>{title}</div>
      {items.map((it) => {
        const p = prog(f, it.at, 10);
        const ok = it.ok !== false;
        return (
          <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 20, height: size * 1.9, opacity: 0.32 + 0.68 * p }}>
            {ok ? <Tick p={p} size={size + 6} /> : <Cross p={p} size={size + 6} />}
            <span style={{ fontSize: size, color: ok ? C.text : '#ff9c8f', fontWeight: 500 }}>{it.label}{ok ? '' : ''}</span>
          </div>
        );
      })}
    </div>
  );
};
