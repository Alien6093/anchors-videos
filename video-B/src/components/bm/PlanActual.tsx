import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { WidgetHeader } from '../CleoWidget';
import { easeInOut, lerp, prog } from '../anim';
import { FORECAST_HIGH } from '../../lib/dataB';
import { ForecastBand } from './ForecastBand';

export const MARKER_FROM = 185700;
export const MARKER_TO = 280000;
const TRAVEL_START = 4;
const TRAVEL_DUR = 68;

export const markerValue = (f: number): number => lerp(MARKER_FROM, MARKER_TO, prog(f, TRAVEL_START, TRAVEL_DUR, easeInOut));

/** First frame at which the marker is above the top of the forecast band. */
export const CROSS_FRAME = (() => {
  for (let f = 0; f < 200; f++) if (markerValue(f) > FORECAST_HIGH) return f;
  return 0;
})();

const Col: React.FC<{ title: string; rows: [string, string][]; tone: 'plan' | 'actual'; opacity: number; chip?: number }> = ({ title, rows, tone, opacity, chip = 0 }) => (
  <div style={{ flex: 1, opacity, fontFamily: FONT_SANS }}>
    <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tone === 'actual' ? C.red : C.inkSoft, marginBottom: 12 }}>{title}</div>
    {rows.map(([k, v]) => (
      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: `1.5px solid ${C.creamLine}` }}>
        <span style={{ fontSize: 26, color: C.inkSoft }}>{k}</span>
        <span style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
      </div>
    ))}
    {tone === 'actual' && (
      <div style={{ marginTop: 16, display: 'inline-block', fontSize: 28, fontWeight: 700, color: '#fff', background: C.greenDeep, padding: '8px 22px', borderRadius: 999, opacity: Math.min(1, chip * 2), transform: `scale(${lerp(0.7, 1, Math.min(1, chip)) + 0.05 * Math.sin(chip * Math.PI)})` }}>Rs 15 below plan</div>
    )}
  </div>
);

/** Scene 9 widget: forecast band with the traveling marker (READ) above Plan | Actual columns (dim). */
export const PlanActual: React.FC = () => {
  const f = useCurrentFrame();
  const enter = prog(f, 0, 6, (t) => t);
  const rise = prog(f, 0, 14);
  const flag = prog(f, CROSS_FRAME, 12);
  const colDim = lerp(1, 0.35, prog(f, 10, 16));
  const colsIn = prog(f, 30, 18);
  return (
    <div style={{ width: 1100, background: C.cream, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.45)', opacity: enter, transform: `translateY(${lerp(40, 0, rise)}px)` }}>
      <div style={{ background: C.creamHead, padding: '22px 34px 18px' }}><WidgetHeader /></div>
      <div style={{ padding: '62px 50px 6px' }}>
        <ForecastBand variant="cream" width={1000} value={markerValue(f)} bandOpacity={1} tickOpacity={0.35} flag={flag} tick={0} />
      </div>
      <div style={{ display: 'flex', gap: 48, padding: '6px 50px 34px', transform: `translateY(${lerp(30, 0, colsIn)}px)`, opacity: colsIn }}>
        <Col title="Plan" tone="plan" opacity={colDim} rows={[['Projected', '2.69-2.77 lakh'], ['Est. CPM', 'Rs 540'], ['Max spend', 'Rs 1,49,712']]} />
        <Col title="Actual" tone="actual" opacity={colDim} chip={prog(f, 93, 12)} rows={[['Impressions', '2,80,000'], ['Effective CPM', 'Rs 525'], ['Spent', 'Rs 1,47,000']]} />
      </div>
    </div>
  );
};
