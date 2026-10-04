import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_DISPLAY, FONT_SANS } from '../components/theme';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { Band, useFmt } from './ctx';
import { CardHeader, CreamCard, PlanTitle, Tool, enter } from './ui';
import { AnchorsMark } from '../components/AnchorsLogo';

const BUBBLE_LINES = ['Build a LinkedIn', 'creator campaign for', 'https://zeko.ai.', 'Budget Rs 3 lakh.'] as const;
const KEY_LINES = new Set([2, 3]);

export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { is916 } = useFmt();
  const push = lerp(1, 1.04, prog(f, 0, 60, (t) => t)) * (is916 ? 1 : 1.1);
  return (
    <Band scale={push} style={{ gap: 30 }}>
      <div style={{ background: C.bubble, borderRadius: 52, padding: '44px 48px', border: `2px solid ${C.border}`, boxShadow: '0 30px 70px rgba(0,0,0,.5)', fontFamily: FONT_SANS, fontSize: 58, lineHeight: 1.22, fontWeight: 500, color: C.text }}>
        {BUBBLE_LINES.map((l, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap', fontWeight: KEY_LINES.has(i) ? 800 : 500, color: KEY_LINES.has(i) ? '#fff' : C.text }}>{l}</div>
        ))}
      </div>
      <Tool label="Used anchors integration, loaded tools" done t={99} />
    </Band>
  );
};

type ChipRow = { label: string; value: string; at: number };
const ROWS: readonly ChipRow[] = [
  { label: 'Audience', value: 'HR professionals', at: 0 },
  { label: 'Product', value: 'Zeko AI Platform', at: 15 },
  { label: 'Motive', value: 'Awareness', at: 30 },
];

export const AsksScene: React.FC = () => {
  const f = useCurrentFrame();
  const toolP = prog(f, 45, 8, easeOut);
  return (
    <Band style={{ gap: 28 }}>
      {ROWS.map((r) => {
        const p = f >= r.at ? pop(f, r.at, 11, 220, 0.6) : 0;
        const on = f >= r.at;
        return (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 28, fontFamily: FONT_SANS }}>
            <div style={{ width: 232, fontSize: 44, color: on ? C.text : C.muted, fontWeight: 500 }}>{r.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '24px 40px', borderRadius: 999, fontSize: 54, fontWeight: 800, transform: `scale(${on ? 0.94 + 0.06 * p : 1})`, transformOrigin: 'left center', background: on ? C.cream : 'rgba(255,255,255,.06)', color: on ? C.ink : C.muted, border: on ? `3px solid ${C.cream}` : `3px solid ${C.border}`, boxShadow: on ? '0 14px 40px rgba(0,0,0,.45)' : 'none' }}>
              {on ? <svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={C.greenDeep} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              {r.value}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 24, alignSelf: 'flex-start', padding: '24px 38px 24px 30px', borderRadius: 44, background: C.panel, border: `2px solid ${C.orange}`, fontFamily: FONT_SANS, color: C.text, opacity: toolP, transform: `translateY(${(1 - toolP) * 18}px)` }}>
        <AnchorsMark size={56} />
        <div>
          <div style={{ fontSize: 42, fontWeight: 800, color: C.orange, letterSpacing: '0.04em' }}>CLEO</div>
          <div style={{ fontSize: 46, fontWeight: 600 }}>Build the full campaign plan</div>
        </div>
      </div>
    </Band>
  );
};

export const PlanScene: React.FC = () => {
  const f = useCurrentFrame();
  const e = enter(f, 8, 0.7);
  const sel1 = prog(f, 10, 8);
  const sel2 = prog(f, 30, 8);
  const box = (p: number): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: 22, padding: '26px 30px', borderRadius: 26, border: `3px solid ${p > 0.5 ? C.red : C.creamLine}`, background: p > 0.5 ? '#fff' : 'transparent', fontSize: 48, fontWeight: 800, lineHeight: 1.22 });
  const radio = (p: number) => (
    <div style={{ width: 40, height: 40, borderRadius: 40, border: `4px solid ${C.red}`, flex: 'none', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 6, borderRadius: 40, background: C.red, transform: `scale(${p})` }} />
    </div>
  );
  return (
    <Band>
      <CreamCard style={{ opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
        <CardHeader />
        <div style={{ marginTop: 14 }}><PlanTitle size={74} /></div>
        <div style={{ marginTop: 34, fontSize: 42, color: C.inkSoft, fontWeight: 500 }}>Storyline</div>
        <div style={{ marginTop: 12, ...box(sel1) }}>{radio(sel1)}<span>Structured interviews still hide gut decisions</span></div>
        <div style={{ marginTop: 34, fontSize: 42, color: C.inkSoft, fontWeight: 500 }}>Direction</div>
        <div style={{ marginTop: 12, ...box(sel2) }}>{radio(sel2)}<span>Myth-busting - hidden truth</span></div>
      </CreamCard>
    </Band>
  );
};

const BAR_L = 0.12;
const BAR_R = 0.88;

export const ReachScene: React.FC = () => {
  const f = useCurrentFrame();
  const e = enter(f, 8, 0.7);
  const draw = prog(f, 6, 30, easeOut);
  const lock = f >= 60 ? pop(f, 60, 7, 300, 0.5) : 0;
  const lockFlash = f >= 60 ? 1 - prog(f, 60, 14) : 0;
  const trackW = 832;
  return (
    <Band>
      <CreamCard style={{ opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
        <CardHeader />
        <div style={{ marginTop: 30, fontSize: 44, color: C.inkSoft, fontWeight: 500 }}>Projected impressions</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, fontFamily: FONT_DISPLAY, color: C.ink, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 170, lineHeight: 1.05, letterSpacing: '-0.02em' }}>5.42-5.58</span>
          <span style={{ fontSize: 76 }}>lakh</span>
        </div>
        <div style={{ position: 'relative', marginTop: 22, height: 34, width: trackW, borderRadius: 34, background: C.creamLine }}>
          <div style={{ position: 'absolute', left: trackW * BAR_L, width: trackW * (BAR_R - BAR_L) * draw, top: 0, bottom: 0, borderRadius: 34, background: `linear-gradient(90deg, ${C.amber}, ${C.orange}, ${C.red})`, boxShadow: `0 0 ${24 * lockFlash}px ${C.orange}` }} />
          {[BAR_L, BAR_R].map((x, i) => (
            <div key={i} style={{ position: 'absolute', left: trackW * x - 4, top: -14 - 8 * lock, width: 8, height: 62 + 16 * lock, borderRadius: 4, background: C.ink, opacity: draw > (i ? 0.95 : 0.05) ? 1 : 0 }} />
          ))}
        </div>
        <div style={{ marginTop: 50, paddingTop: 30, borderTop: `3px solid ${C.creamLine}`, display: 'flex', alignItems: 'baseline', gap: 30 }}>
          <div>
            <div style={{ fontSize: 44, color: C.inkSoft, fontWeight: 500 }}>Est. CPM <span style={{ fontSize: 42 }}>(cost per 1,000 views)</span></div>
            <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Rs 540</div>
          </div>
        </div>
      </CreamCard>
    </Band>
  );
};
