import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_SERIF } from '../components/theme';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { Band } from './ctx';
import { CreamCard, Photo, enter } from './ui';
import { CREATORS } from './tokens';
import { BeforeAfterCard } from './scenesB';

/* ---------------- 8 BRIEFS ---------------- */
export const RosterGrid: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    {CREATORS.map((c, i) => {
      const p = Math.min(1, 0.5 + prog(t, (i - 3) * 3, 10, easeOut));
      return (
        <div key={c.first} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '14px 28px 14px 14px', borderRadius: 999, background: C.cream, color: C.ink, fontFamily: FONT_SANS, fontSize: 50, fontWeight: 800, opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
          <Photo file={c.file} size={92} />
          <span>{c.first}</span>
        </div>
      );
    })}
  </div>
);

const LABELS = ['Ask', 'Key points', 'Example angles', 'Avoid', 'Hashtags', 'Engagement tip'] as const;
const AVOID_AT = 60;

export const BriefCard: React.FC<{ t: number }> = ({ t }) => {
  const hi = prog(t, AVOID_AT, 8, easeOut);
  return (
    <CreamCard pad={36}>
      {LABELS.map((l, i) => {
        const p = Math.min(1, 0.4 + prog(t, i * 10, 8, easeOut));
        const isAvoid = l === 'Avoid';
        return (
          <div key={l} style={{ opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 66, padding: '0 24px', borderRadius: 20, fontSize: 48, fontWeight: 800, background: isAvoid ? `rgba(214,58,47,${0.12 * hi})` : 'transparent', color: isAvoid && hi > 0.5 ? C.red : C.ink }}>{l}</div>
            {isAvoid ? (
              <div style={{ overflow: 'hidden', height: 168 * hi, padding: '0 24px', fontFamily: FONT_SERIF, fontSize: 44, lineHeight: 1.32, color: C.ink, opacity: hi }}>
                Press-release tone (“excited to announce”, “revolutionary”).
              </div>
            ) : null}
          </div>
        );
      })}
    </CreamCard>
  );
};

const BRIEF_AT = 30;
export const BriefsScene: React.FC = () => {
  const f = useCurrentFrame();
  return f < BRIEF_AT ? <Band><RosterGrid t={f} /></Band> : <Band><BriefCard t={f - BRIEF_AT} /></Band>;
};

/* ---------------- 9 QUOTE ---------------- */
const QUOTE_ROWS = [
  { l: 'Creator fees', v: 'Rs 1,13,251' },
  { l: 'Platform fee', v: 'Rs 11,325' },
  { l: 'Subtotal', v: 'Rs 1,24,576' },
  { l: 'GST (18%)', v: 'Rs 22,424' },
] as const;
const ROW_AT = [0, 8, 15, 23] as const;
const TOTAL_AT = 30;

export const QuoteScene: React.FC = () => {
  const f = useCurrentFrame();
  const tp = Math.min(1, prog(f, TOTAL_AT, 6, easeOut));
  return (
    <Band>
      <CreamCard pad={40}>
        {QUOTE_ROWS.map((r, i) => {
          const p = f >= ROW_AT[i] ? Math.min(1, 0.4 + prog(f, ROW_AT[i], 6, easeOut)) : 0.22;
          return (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 100, borderBottom: `3px solid ${C.creamLine}`, fontSize: 48, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, paddingTop: 20 }}>
              <span style={{ color: C.inkSoft, fontWeight: 500 }}>{r.l}</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
            </div>
          );
        })}
        <div style={{ marginTop: 28, padding: '30px 34px', borderRadius: 28, background: C.ink, color: '#fff', opacity: f >= TOTAL_AT ? 1 : 0.22, transform: `scale(${f >= TOTAL_AT ? lerp(0.96, 1, tp) : 1})` }}>
          <div style={{ fontSize: 44, fontWeight: 500, color: '#d6d1ca' }}>Total payable</div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Rs 1,47,000</div>
        </div>
      </CreamCard>
    </Band>
  );
};

/* ---------------- 10 PAY ---------------- */
const STEPS = [
  { l: 'Brief', done: true }, { l: 'Quote', done: true }, { l: 'Payment', done: true }, { l: 'Live', done: false },
] as const;

export const PayScene: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 0, 15, easeOut);
  const ring = f < 3 ? 0.9 : pop(f, 0, 9, 200, 0.6);
  const glow = 1 - prog(f, 0, 30);
  return (
    <Band>
      <div style={{ background: C.cream, borderRadius: 44, padding: '36px 36px 40px', fontFamily: FONT_SANS, color: C.ink, boxShadow: '0 30px 80px rgba(0,0,0,.55)', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0 18px' }}>
          <div style={{ position: 'absolute', left: 90, right: 90, top: 26, height: 5, background: C.creamLine }} />
          {STEPS.map((s) => (
            <div key={s.l} style={{ position: 'relative', width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 54, height: 54, borderRadius: 54, background: s.done ? C.green : C.cream, border: s.done ? 'none' : `4px solid ${C.creamLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.done ? <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              </div>
              <div style={{ fontSize: 42, fontWeight: 700, color: s.done ? C.ink : '#a29c93' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ margin: '26px auto 0', width: 150, height: 150, borderRadius: 150, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ring})`, boxShadow: `0 0 ${70 * glow}px rgba(63,178,127,.8)` }}>
          <svg width="84" height="84" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22" strokeDashoffset={22 * (1 - draw)} /></svg>
        </div>
        <div style={{ marginTop: 18, fontSize: 62, fontWeight: 800, letterSpacing: '-0.03em' }}>Payment successful</div>
        <div style={{ fontSize: 122, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08 }}>Rs 1,47,000</div>
        <div style={{ margin: '14px auto 0', display: 'inline-block', padding: '10px 34px', borderRadius: 999, background: 'rgba(63,178,127,.16)', color: C.greenDeep, fontSize: 44, fontWeight: 800 }}>Campaign activated</div>
        <div style={{ marginTop: 14, fontSize: 44, color: C.inkSoft, fontWeight: 500 }}>Briefed 8 · Mon 28 Sep 2026</div>
      </div>
    </Band>
  );
};

/* ---------------- 11 SENT ---------------- */
const STAMP_AT = 12;
const STAMP_STEP = 3;
const PEAK = STAMP_AT + STAMP_STEP * 7;

export const SentScene: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(1, 1.03, prog(f, 60, 60, (t) => t));
  const burst = f >= PEAK ? prog(f, PEAK, 22, easeOut) : 0;
  return (
    <Band scale={push} align="start" style={{ paddingTop: 20 }}>
      <div style={{ position: 'absolute', left: 460 - 420, top: 380, width: 840, height: 840, borderRadius: 840, background: 'radial-gradient(circle, rgba(255,255,255,.5), rgba(63,178,127,.25) 40%, rgba(63,178,127,0) 70%)', opacity: burst > 0 ? (1 - burst) * 0.9 : 0, transform: `scale(${0.4 + burst})` }} />
      <div style={{ position: 'relative', fontFamily: FONT_SERIF, fontSize: 56, lineHeight: 1.22, color: C.text, marginBottom: 38 }}>
        <div>Payment received.</div>
        <div>Briefs sent to 8 creators.</div>
      </div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {CREATORS.map((c, i) => {
          const at = STAMP_AT + i * STAMP_STEP;
          const stamped = f >= at;
          const p = stamped ? pop(f, at, 9, 260, 0.5) : 0;
          return (
            <div key={c.first} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 22px 14px 14px', borderRadius: 34, background: C.panel, border: `2px solid ${stamped ? 'rgba(63,178,127,.6)' : C.border}`, fontFamily: FONT_SANS }}>
              <Photo file={c.file} size={92} />
              <div>
                <div style={{ fontSize: 46, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{c.first}</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: C.green, lineHeight: 1.15, opacity: stamped ? Math.min(1, p * 2) : 0, transform: `scale(${stamped ? lerp(1.5, 1, Math.min(1, p)) : 1}) rotate(${stamped ? lerp(-8, 0, Math.min(1, p)) : 0}deg)`, transformOrigin: 'left center' }}>Brief sent</div>
              </div>
            </div>
          );
        })}
      </div>
    </Band>
  );
};

/* ---------------- 12 RECAP ---------------- */
const PLATE_STYLE: React.CSSProperties = { filter: 'blur(7px)', opacity: 0.32 };

export const RecapScene: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 60 ? 0 : f < 120 ? 1 : 2;
  const calm = prog(f, 120, 60, (t) => t);
  return (
    <Band style={{ ...PLATE_STYLE, opacity: lerp(0.32, 0.12, calm) }}>
      {phase === 0 ? <RosterGrid t={999} /> : phase === 1 ? <BeforeAfterCard f={999} /> : <BriefCard t={999} />}
    </Band>
  );
};
