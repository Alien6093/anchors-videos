import React from 'react';
import { C, FONT_SANS } from '../theme';
import { fmtIN } from '../anim';
import { FORECAST_HIGH, FORECAST_LOW } from '../../lib/dataB';

const AXIS_MAX = 300000;
const TICKS = [0, 100000, 200000, 300000];

type Props = {
  variant: 'dark' | 'cream';
  width: number;
  /** marker value in impressions; null hides marker */
  value: number | null;
  /** show the filled bar from zero to the marker */
  fill?: boolean;
  /** 0..1 opacity of forecast label + ticks (dimmed to 35% for READ scenes) */
  bandOpacity?: number;
  tickOpacity?: number;
  /** 0..1 pop of the flag that says "above range" */
  flag?: number;
  /** 0..1 pop of the green tick next to marker */
  tick?: number;
  valueLabel?: boolean;
  blur?: number;
};

const px = (v: number, w: number) => (v / AXIS_MAX) * w;

export const ForecastBand: React.FC<Props> = ({ variant, width, value, fill = true, bandOpacity = 1, tickOpacity = 0.6, flag = 0, tick = 0, valueLabel = true, blur = 0 }) => {
  const dark = variant === 'dark';
  const ink = dark ? '#fff' : C.ink;
  const soft = dark ? C.muted : C.inkSoft;
  const track = dark ? 'rgba(255,255,255,.12)' : C.creamLine;
  const bandX = px(FORECAST_LOW, width);
  const bandW = px(FORECAST_HIGH - FORECAST_LOW, width);
  const mx = value === null ? 0 : px(value, width);
  return (
    <div style={{ position: 'relative', width, height: 204, fontFamily: FONT_SANS, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, height: 26, borderRadius: 13, background: track }} />
      {fill && value !== null && <div style={{ position: 'absolute', left: 0, top: 96, height: 26, width: mx, borderRadius: 13, background: dark ? 'linear-gradient(90deg, #6e6b65, #f4efe7)' : `linear-gradient(90deg, ${C.orange}, ${C.red})` }} />}
      <div style={{ position: 'absolute', left: bandX, width: bandW, top: 80, height: 58, borderRadius: 8, background: dark ? 'rgba(251,247,241,.30)' : 'rgba(214,58,47,.22)', border: `2px solid ${dark ? 'rgba(251,247,241,.7)' : C.red}`, boxSizing: 'border-box', opacity: Math.max(bandOpacity, 0.35) }} />
      <div style={{ position: 'absolute', right: 0, top: 168, fontSize: 28, fontWeight: 600, color: dark ? C.cream : C.red, opacity: bandOpacity, whiteSpace: 'nowrap' }}>Forecast 2.69-2.77 lakh</div>
      {TICKS.map((t) => (
        <div key={t} style={{ position: 'absolute', left: px(t, width), top: 138, transform: `translateX(${t === 0 ? 0 : t === AXIS_MAX ? '-100%' : '-50%'})`, fontSize: 24, color: soft, opacity: tickOpacity, whiteSpace: 'nowrap' }}>
          {t === 0 ? '0' : `${t / 100000} lakh`}
        </div>
      ))}
      {value !== null && (
        <>
          <div style={{ position: 'absolute', left: mx - 3, top: 72, width: 6, height: 74, borderRadius: 3, background: ink, boxShadow: dark ? '0 0 24px rgba(255,255,255,.6)' : undefined }} />
          {valueLabel && (
            <div style={{ position: 'absolute', left: mx, top: 20, transform: 'translateX(-50%)', fontSize: 40, fontWeight: 800, color: ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{fmtIN(value)}</div>
          )}
          {tick > 0 && (
            <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: 'absolute', left: mx + 16, top: 82, transform: `scale(${Math.min(1.15, tick * 1.3)})`, opacity: Math.min(1, tick * 2) }}>
              <circle cx="12" cy="12" r="11" fill={`${C.green}44`} />
              <path d="M6 12.5l4 4L18 8" fill="none" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {flag > 0.02 && (
            <div style={{ position: 'absolute', left: mx, top: -34, transform: `translateX(-50%) translateY(${(1 - Math.min(1, flag)) * 20}px) scale(${0.8 + 0.2 * Math.min(1, flag)})`, opacity: Math.min(1, flag * 2), fontSize: 26, fontWeight: 700, color: '#fff', background: C.green, padding: '6px 18px', borderRadius: 999, whiteSpace: 'nowrap' }}>above range</div>
          )}
        </>
      )}
    </div>
  );
};
