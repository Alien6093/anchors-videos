import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { AnchorsLogo } from '../AnchorsLogo';
import { fmtIN, lerp, pop, prog, easeOut } from '../anim';

const PAGE = '#FBF7F1';

/** Light payment success page: exactly four elements (check, amount, chip, line) plus the small logo as page chrome. Local frames. */
export const PaymentPageA: React.FC<{ checkAt: number; amountAt: number; chipAt: number; lineAt: number }> = ({ checkAt, amountAt, chipAt, lineAt }) => {
  const f = useCurrentFrame();
  const drift = lerp(1, 1.02, prog(f, 0, 70, (t) => t));
  const checkP = prog(f, checkAt, 10);
  const circ = pop(f, checkAt, 12, 130);
  const head = prog(f, amountAt - 4, 8);
  const amount = 147000 * prog(f, amountAt, 16, easeOut);
  const chip = prog(f, chipAt, 8, easeOut);
  const line = prog(f, lineAt, 10);
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 42%, #fff 0%, ${PAGE} 60%)`, fontFamily: FONT_SANS, transform: `scale(${drift})`, color: C.ink }}>
      <div style={{ position: 'absolute', left: 80, top: 56 }}><AnchorsLogo size={44} textColor={C.ink} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 210, height: 210, borderRadius: 105, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.min(1.1, circ)})`, boxShadow: `0 0 ${80 * checkP}px rgba(63,178,127,.35)` }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - checkP)} /></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontSize: 88, fontWeight: 800, letterSpacing: '-0.04em', opacity: head, transform: `translateY(${lerp(20, 0, head)}px)` }}>Payment successful</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontSize: 148, fontWeight: 800, letterSpacing: '-0.045em', fontVariantNumeric: 'tabular-nums', opacity: prog(f, amountAt, 4) }}>Rs {fmtIN(amount)}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: '#fff', background: C.orange, borderRadius: 999, padding: '14px 42px', opacity: chip, transform: `translateX(${lerp(-260, 0, chip)}px)` }}>Campaign activated</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontSize: 38, color: C.inkSoft, opacity: line }}>Briefed 8 · Mon 28 Sep 2026</div>
    </div>
  );
};
