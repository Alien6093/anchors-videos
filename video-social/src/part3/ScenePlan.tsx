import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog, easeInOut, easeOut } from '../lib/anim';
import { Pill } from './kit';
import { useLay } from './base';

const SWEEP_AT = 516;
const SWEEP_DUR = 72;
const FLAG_AT = 592;
const CARD_AT = 600;
const CHIP_AT = 660;
/** axis 2.0 - 3.0 lakh; forecast band 2.69-2.77, final 2.80 */
const BAND = { a: 0.69, b: 0.77 };
const FINAL = 0.8;

const Band: React.FC<{ f: number }> = ({ f }) => {
  const { dw } = useLay();
  const c = prog(f, CARD_AT, 12, easeInOut);
  const cy = lerp(330, 120, c);
  const trackH = lerp(34, 22, c);
  const brH = lerp(86, 56, c);
  const mkH = lerp(110, 68, c);
  const labelO = 1 - prog(f, 584, 8);
  const axisO = 1 - prog(f, 590, 10);
  const flag = pop(f, FLAG_AT, 12, 200);
  const t = prog(f, SWEEP_AT, SWEEP_DUR, easeOut);
  const markX = dw * FINAL * t;
  const crossed = markX > dw * BAND.b;
  
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: dw, fontFamily: FONT_SANS }}>
      <div style={{ position: 'absolute', left: 0, top: cy - 150, width: dw, textAlign: 'center', fontSize: 52, fontWeight: 700, color: '#ff7d6e', opacity: labelO }}>Forecast 2.69-2.77 lakh</div>
      <div style={{ position: 'absolute', left: 0, top: cy - trackH / 2, width: dw, height: trackH, borderRadius: trackH / 2, background: 'rgba(255,255,255,.09)' }} />
      <div style={{ position: 'absolute', left: dw * BAND.a, top: cy - brH / 2, width: dw * (BAND.b - BAND.a), height: brH, borderRadius: 12, background: 'rgba(255,125,110,.28)', border: '3px solid #ff7d6e', boxSizing: 'border-box' }} />
      <div style={{ position: 'absolute', left: 0, top: cy - trackH / 2, width: markX, height: trackH, borderRadius: trackH / 2, background: `linear-gradient(90deg, ${C.orange}, ${crossed ? C.green : '#ff7d6e'})` }} />
      <div style={{ position: 'absolute', left: markX - 6, top: cy - mkH / 2, width: 12, height: mkH, borderRadius: 6, background: '#fff', boxShadow: '0 0 24px rgba(255,255,255,.5)' }} />
      <div style={{ position: 'absolute', left: 0, top: cy + 80, width: dw, display: 'flex', justifyContent: 'space-between', fontSize: 44, color: C.muted, fontWeight: 600, opacity: axisO }}>
        <span>2 lakh</span><span>2.5 lakh</span><span>3 lakh</span>
      </div>
      {f >= FLAG_AT && (
        <div style={{ position: 'absolute', right: 0, top: cy - mkH / 2 - 86, opacity: Math.min(1, flag * 2), transform: `scale(${lerp(0.8, 1, Math.min(1, flag))})`, transformOrigin: '50% 100%' }}>
          <Pill size={50} color="#fff" bg={C.greenDeep}>{'\u2191'} Above range</Pill>
        </div>
      )}
    </div>
  );
};

const Cell: React.FC<{ children: React.ReactNode; hot?: boolean }> = ({ children, hot }) => (
  <div style={{ width: '50%', textAlign: 'center', fontSize: 60, fontWeight: 800, letterSpacing: '-0.03em', color: hot ? '#fff' : '#b8b5ae', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{children}</div>
);

const ROWS: { label: string; plan: React.ReactNode; actual: React.ReactNode; at: number }[] = [
  { label: 'Impressions', plan: <>2.69-2.77<span style={{ fontSize: 40, fontWeight: 700 }}> lakh</span></>, actual: '2,80,000', at: 610 },
  { label: 'CPM, cost per 1,000 views', plan: 'Rs 540', actual: 'Rs 525', at: 622 },
  { label: 'Max spend vs spent', plan: 'Rs 1,49,712', actual: 'Rs 1,47,000', at: 634 },
];

const PlanCard: React.FC<{ f: number }> = ({ f }) => {
  const { dw } = useLay();
  const head = prog(f, CARD_AT + 4, 8);
  return (
    <div style={{ position: 'absolute', left: 0, top: 178, width: dw, fontFamily: FONT_SANS }}>
      <div style={{ display: 'flex', opacity: head, borderBottom: `2px solid ${C.border}`, paddingBottom: 8 }}>
        <div style={{ width: '50%', textAlign: 'center', fontSize: 44, fontWeight: 800, letterSpacing: '0.1em', color: C.muted }}>PLAN</div>
        <div style={{ width: '50%', textAlign: 'center', fontSize: 44, fontWeight: 800, letterSpacing: '0.1em', color: '#5ed39d' }}>ACTUAL</div>
      </div>
      {ROWS.map((r) => {
        const p = pop(f, r.at, 14, 190);
        return (
          <div key={r.label} style={{ height: 134, paddingTop: 8, boxSizing: 'border-box', borderBottom: `1.5px solid ${C.border}`, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(30, 0, Math.min(1, p))}px)` }}>
            <div style={{ textAlign: 'center', fontSize: 44, color: C.muted, fontWeight: 600, lineHeight: 1.15 }}>{r.label}</div>
            <div style={{ display: 'flex', marginTop: 4 }}><Cell>{r.plan}</Cell><Cell hot>{r.actual}</Cell></div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, opacity: Math.min(1, pop(f, CHIP_AT, 12, 200) * 2), transform: `scale(${lerp(0.8, 1, Math.min(1, pop(f, CHIP_AT, 12, 200)))})` }}>
        <Pill size={50} color="#fff" bg={C.greenDeep}>Rs 15 below plan</Pill>
      </div>
    </div>
  );
};

/** f 510-689: forecast band with the marker sweep (no digits), then the Plan vs Actual card. */
export const ScenePlan: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Band f={f} />
    {f >= CARD_AT && <PlanCard f={f} />}
  </>
);
