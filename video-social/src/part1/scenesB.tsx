import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_DISPLAY, FONT_SANS } from '../components/theme';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { Band, useFmt } from './ctx';
import { CreamCard, Photo, Silhouette, Tool, TypedLines, enter } from './ui';
import { CREATORS } from './tokens';

/* ---------------- 5 CREATORS ---------------- */
const SILHOUETTE_COUNT = 8;
const TILES: readonly (number | null)[] = [0, null, 3, 4, null, 1, null, 5, 6, null, 2, null, 7, null, null, null]
  .map((v) => v) as (number | null)[];

const SortChip: React.FC<{ press?: number }> = ({ press = 0 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 34px', borderRadius: 999, background: C.cream, color: C.ink, fontFamily: FONT_SANS, fontSize: 44, fontWeight: 600, transform: `scale(${1 - 0.06 * press})`, boxShadow: press > 0 ? `0 0 0 ${10 * press}px rgba(232,116,59,.35)` : 'none' }}>
    Sort: <b style={{ fontWeight: 800 }}>Engagement</b>
    <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke={C.red} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const Grid: React.FC<{ f: number }> = ({ f }) => {
  const { is916 } = useFmt();
  const tile = is916 ? 146 : 190;
  const gap = is916 ? 14 : 20;
  const chipP = f >= 66 ? pop(f, 66, 12, 200, 0.6) : 0;
  const press = f >= 86 && f < 100 ? Math.sin(((f - 86) / 14) * Math.PI) : 0;
  let silh = 0;
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${tile}px)`, gap, alignSelf: 'center', transform: `scale(${lerp(1, 1.03, prog(f, 0, 100, (t) => t))})` }}>
        {TILES.map((c, i) => {
          const p = Math.min(1, 0.45 + prog(f, (i - 2) * 2, 12));
          return (
            <div key={i} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
              {c === null ? <Silhouette size={tile} tone={silh++ % SILHOUETTE_COUNT} radius={26} /> : <Photo file={CREATORS[c].file} size={tile} radius={26} />}
            </div>
          );
        })}
      </div>
      <div style={{ alignSelf: 'center', marginTop: 20, opacity: Math.min(1, chipP), transform: `translateY(${(1 - Math.min(1, chipP)) * 20}px)` }}><SortChip press={press} /></div>
    </>
  );
};

const SORTED = [
  { c: 3, v: '3.64%' }, { c: 4, v: '3.46%' }, { c: 0, v: '1.97%' },
] as const;

const SortedRows: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ alignSelf: 'center', marginBottom: 22 }}><SortChip /></div>
    {SORTED.map((r, i) => {
      const p = Math.min(1, 0.5 + prog(f, i * 4, 8, easeOut));
      const cr = CREATORS[r.c];
      return (
        <div key={r.v} style={{ marginBottom: 16, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: 'flex', alignItems: 'center', gap: 26, background: C.cream, borderRadius: 36, padding: '22px 34px', fontFamily: FONT_SANS, color: C.ink, boxShadow: '0 18px 50px rgba(0,0,0,.45)' }}>
          <Photo file={cr.file} size={132} ring={C.creamLine} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{cr.full}</div>
            <div style={{ fontSize: 42, color: C.inkSoft, fontWeight: 500 }}>{cr.city}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 76, fontWeight: 800, color: C.red, letterSpacing: '-0.03em', lineHeight: 1 }}>{r.v}</div>
            <div style={{ fontSize: 42, color: C.inkSoft, fontWeight: 500, marginTop: 4 }}>Engagement</div>
          </div>
        </div>
      );
    })}
  </>
);

const SORT_CUT = 105;
export const CreatorsScene: React.FC = () => {
  const f = useCurrentFrame();
  return f < SORT_CUT ? <Band><Grid f={f} /></Band> : <Band><SortedRows f={f - SORT_CUT} /></Band>;
};

/* ---------------- 6 CUT ---------------- */
const CUT_LINES = ['Cut to the 8 closest fits', 'and cap the budget at', 'Rs 1,50,000.'] as const;
const CUT_TOTAL = CUT_LINES.join(' ').length;
const TYPE_END = 88;
const ENTER_AT = 90;

export const CutScene: React.FC = () => {
  const f = useCurrentFrame();
  const sent = f >= ENTER_AT;
  const n = Math.round(CUT_TOTAL * prog(f, 0, TYPE_END, (t) => t));
  const thock = sent ? 1 - prog(f, ENTER_AT, 8) : 0;
  const t1 = f - ENTER_AT;
  const t2 = f - (ENTER_AT + 15);
  return (
    <Band style={{ gap: 30 }}>
      <div style={{ position: 'relative', background: sent ? C.bubble : C.panel, border: `3px solid ${sent ? C.border : C.orange}`, borderRadius: 52, padding: '44px 48px', transform: `translateY(${-thock * -14}px) scale(${1 - 0.015 * thock})`, boxShadow: sent ? '0 20px 60px rgba(0,0,0,.4)' : `0 0 40px rgba(232,116,59,.25)` }}>
        <TypedLines lines={CUT_LINES} n={n} caret={!sent && f % 16 < 11} size={54} color="#fff" />
        {!sent ? (
          <div style={{ position: 'absolute', right: 30, bottom: 30, width: 76, height: 76, borderRadius: 76, background: n >= CUT_TOTAL ? C.orange : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        ) : null}
      </div>
      {sent ? <Tool label="CLEO - Adjust the creator list" done={t1 > 40} t={t1} /> : null}
      {t2 >= 0 ? <Tool label="CLEO - What this campaign costs" done={t2 > 40} t={t2} /> : null}
    </Band>
  );
};

/* ---------------- 7 DROP ---------------- */
const ROLL_AT = 12;
const ROLL_DUR = 8;
const CARD_AT = 45;

const Roll: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, ROLL_AT, ROLL_DUR, easeOut);
  const H = 440;
  const style: React.CSSProperties = { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 900, fontSize: 420, lineHeight: 1, letterSpacing: '-0.05em' };
  return (
    <div style={{ position: 'relative', height: H, overflow: 'hidden' }}>
      <div style={{ ...style, color: '#fff', transform: `translateY(${-p * H}px)`, filter: `blur(${p * 10}px)`, opacity: 1 - p }}>16</div>
      <div style={{ ...style, color: C.orange, transform: `translateY(${(1 - p) * H}px)`, filter: `blur(${(1 - p) * 10}px)`, opacity: p }}>8</div>
    </div>
  );
};

type Row = { label: string; before: string; after: string; at: number };
const BA_ROWS: readonly Row[] = [
  { label: 'Budget', before: 'Rs 3,00,000', after: 'Rs 1,50,000', at: 0 },
  { label: 'Projected impressions', before: '5.42-5.58 lakh', after: '2.69-2.77 lakh', at: 15 },
];

export const BeforeAfterCard: React.FC<{ f: number }> = ({ f }) => {
  const e = enter(f, 6, 0.8);
  return (
    <CreamCard style={{ opacity: e }}>
      {BA_ROWS.map((r, i) => {
        const w = prog(f, r.at, 9, easeOut);
        return (
          <div key={r.label} style={{ paddingTop: i ? 34 : 0, marginTop: i ? 34 : 0, borderTop: i ? `3px solid ${C.creamLine}` : 'none' }}>
            <div style={{ fontSize: 44, color: C.inkSoft, fontWeight: 500 }}>{r.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 10, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 44, color: C.inkSoft, textDecoration: 'line-through', fontWeight: 500 }}>{r.before}</span>
              <svg width="52" height="52" viewBox="0 0 24 24" style={{ flex: 'none' }}><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, opacity: f >= r.at ? 1 : 0 }}>{r.after}</span>
            </div>
          </div>
        );
      })}
    </CreamCard>
  );
};

export const DropScene: React.FC = () => {
  const f = useCurrentFrame();
  if (f < CARD_AT) {
    return (
      <Band>
        <Roll f={f} />
        <div style={{ textAlign: 'center', fontFamily: FONT_SANS, fontSize: 70, fontWeight: 700, color: C.text, marginTop: 6 }}>creators</div>
      </Band>
    );
  }
  return <Band><BeforeAfterCard f={f - CARD_AT} /></Band>;
};

void FONT_DISPLAY;
