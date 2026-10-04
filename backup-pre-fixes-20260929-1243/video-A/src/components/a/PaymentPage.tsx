import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { AnchorsLogo } from '../AnchorsLogo';
import { fmtIN, lerp, pop, prog, easeOut } from '../anim';

const PAGE = '#FBF7F1';
const STEPS = ['Brief', 'Quote', 'Payment', 'Live'];

const Step: React.FC<{ i: number; done: boolean; at: number }> = ({ i, done, at }) => {
  const f = useCurrentFrame();
  const p = pop(f, at + i * 4, 12, 200);
  const ck = prog(f, at + i * 4 + 4, 8);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(-16, 0, Math.min(1, p))}px)` }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: done ? C.green : 'transparent', border: done ? 'none' : `3px solid ${C.creamLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {done && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - ck)} /></svg>}
      </div>
      <span style={{ fontSize: 34, fontWeight: done ? 600 : 400, color: done ? C.ink : '#a29a8f' }}>{STEPS[i]}</span>
    </div>
  );
};

/** Light anchors dashboard page with exactly the 5 spec elements (plus the small logo as page chrome). */
export const PaymentPage: React.FC<{ base?: number }> = ({ base = 0 }) => {
  const f = useCurrentFrame() - base;
  const drift = lerp(1, 1.02, prog(f, 0, 130, (t) => t));
  const checkP = prog(f, 30, 15);
  const circ = pop(f, 30, 12, 130);
  const amount = 147000 * prog(f, 54, 18, easeOut);
  const chip = prog(f, 84, 9, easeOut);
  const head = prog(f, 48, 10);
  const line = prog(f, 92, 12);
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 42%, #fff 0%, ${PAGE} 60%)`, fontFamily: FONT_SANS, transform: `scale(${drift})`, color: C.ink }}>
      <div style={{ position: 'absolute', left: 80, top: 56 }}><AnchorsLogo size={44} textColor={C.ink} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34 }}>
        {STEPS.map((_, i) => (
          <React.Fragment key={i}>
            <Step i={i} done={i < 3} at={16} />
            {i < 3 && <div style={{ width: 90, height: 4, borderRadius: 2, background: i < 2 ? C.green : C.creamLine }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 210, height: 210, borderRadius: 105, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.min(1.1, circ)})`, boxShadow: `0 0 ${80 * checkP}px rgba(63,178,127,.35)` }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - checkP)} /></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 508, textAlign: 'center', fontSize: 88, fontWeight: 800, letterSpacing: '-0.04em', opacity: head, transform: `translateY(${lerp(20, 0, head)}px)` }}>Payment successful</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontSize: 132, fontWeight: 800, letterSpacing: '-0.045em', fontVariantNumeric: 'tabular-nums', opacity: prog(f, 52, 6) }}>Rs {fmtIN(amount)}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: '#fff', background: C.orange, borderRadius: 999, padding: '14px 40px', opacity: chip, transform: `translateX(${lerp(-260, 0, chip)}px)` }}>Campaign activated</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 895, textAlign: 'center', fontSize: 36, color: C.inkSoft, opacity: line }}>Briefed 8 · Mon 28 Sep 2026</div>
    </div>
  );
};
