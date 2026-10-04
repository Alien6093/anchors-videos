import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_DISPLAY } from '../theme';
import { fmtIN, lerp, pop, prog } from '../anim';
import { DIM } from './kit';

const Label: React.FC<{ t: string }> = ({ t }) => <div style={{ fontSize: 24, color: C.inkSoft, marginBottom: 6 }}>{t}</div>;

const Opt: React.FC<{ text: string; on: boolean; at: number }> = ({ text, on, at }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 16, 170);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: C.ink, fontWeight: on ? 600 : 400, padding: '6px 18px', borderRadius: 12, marginBottom: 4,
      background: on ? '#fff' : 'transparent', border: `1.5px solid ${on ? C.red : 'transparent'}`, opacity: Math.min(1, p * 1.8) * (on ? 1 : 0.8), transform: `translateY(${lerp(18, 0, p)}px)`,
    }}>
      <span style={{ width: 22, height: 22, borderRadius: 11, border: `2.5px solid ${on ? C.red : C.creamLine}`, background: on ? C.red : 'transparent', boxShadow: on ? 'inset 0 0 0 4px #fff' : undefined }} />
      {text}
    </div>
  );
};

const BrandChip: React.FC<{ t: string; at: number }> = ({ t, at }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14, 180);
  return <span style={{ display: 'inline-block', fontSize: 28, padding: '8px 24px', borderRadius: 999, background: '#fff', border: `1.5px solid ${C.creamLine}`, color: C.ink, marginRight: 14, opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.8, 1, Math.min(1, p))})` }}>{t}</span>;
};

/** Setup tab: storyline + directions + comparable brands are the READ; the rest is dimmed to 35%. */
export const SetupPanelA: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame();
  const fields = [['Product', 'Zeko AI Platform'], ['Audience', 'HR professionals'], ['Motive', 'Awareness'], ['Budget', 'Rs 3,00,000']];
  return (
    <div style={{ padding: '20px 34px 20px', fontFamily: FONT_SANS }}>
      <div style={{ display: 'flex', gap: 18, opacity: DIM * prog(f, start, 10) / 1 }}>
        {fields.map(([l, v]) => (
          <div key={l} style={{ flex: 1 }}><Label t={l} /><div style={{ fontSize: 28, color: C.ink, fontWeight: 500, whiteSpace: 'nowrap' }}>{v}</div></div>
        ))}
      </div>
      <div style={{ marginTop: 22 }}>
        <Label t="Storyline" />
        <Opt text="Structured interviews still hide gut decisions" on at={start + 6} />
        <Opt text="What workforce intelligence actually means" on={false} at={start + 12} />
        <Opt text="From interview scorecards to conversation intelligence" on={false} at={start + 18} />
      </div>
      <div style={{ marginTop: 16 }}>
        <Label t="Directions" />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: '0 0 auto' }}><Opt text="Myth-busting - hidden truth" on at={start + 26} /></div>
          <div style={{ flex: '0 0 auto' }}><Opt text="Category education" on={false} at={start + 32} /></div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <Label t="Comparable brands" />
        <div><BrandChip t="Micro1" at={start + 38} /><BrandChip t="LinkedIn" at={start + 42} /><BrandChip t="Fireflies" at={start + 46} /></div>
      </div>
    </div>
  );
};

/** Projection tab: range bar draws (startFrame), stats, creators 16 */
export const ProjectionPanelA: React.FC<{ start?: number; barAt?: number }> = ({ start = 0, barAt = 12 }) => {
  const f = useCurrentFrame();
  const enter = prog(f, start, 12);
  const bar = prog(f, start + barAt, 40);
  const lockP = prog(f, start + barAt + 40, 8);
  const stat = (l: string, v: string, big?: boolean, red?: boolean, d = 0) => (
    <div style={{ flex: 1, opacity: prog(f, start + 30 + d, 12) * (big ? 1 : 0.8) }}>
      <div style={{ fontSize: 24, color: C.inkSoft, marginBottom: 4 }}>{l}</div>
      <div style={{ fontSize: big ? 64 : 34, fontWeight: big ? 800 : 600, color: red ? C.red : C.ink, letterSpacing: big ? '-0.03em' : 0, lineHeight: 1.1 }}>{v}</div>
    </div>
  );
  const A = 0.30, B = 0.30 + 0.5 * bar;
  return (
    <div style={{ padding: '26px 34px', fontFamily: FONT_SANS, opacity: enter }}>
      <div style={{ fontSize: 26, color: C.inkSoft }}>Projected impressions</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 108, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 4 }}>5.42-5.58 <span style={{ fontSize: 60, color: C.inkSoft }}>lakh</span></div>
      <div style={{ position: 'relative', height: 26, borderRadius: 13, background: C.creamLine, marginTop: 34 }}>
        <div style={{ position: 'absolute', left: `${A * 100}%`, width: `${(B - A) * 100}%`, top: 0, bottom: 0, borderRadius: 13, background: `linear-gradient(90deg, ${C.orange}, ${C.red})`, boxShadow: `0 0 ${24 * lockP}px rgba(214,58,47,.5)` }} />
        {[0, 1].map((k) => (
          <div key={k} style={{ position: 'absolute', left: `${(k === 0 ? A : B) * 100}%`, top: -8, width: 8, height: 42, marginLeft: -4, borderRadius: 4, background: C.ink, opacity: k === 0 ? 1 : bar > 0.98 ? 1 : 0 }} />
        ))}
      </div>
      <div style={{ position: 'relative', height: 40, fontSize: 24, color: C.inkSoft, marginTop: 16 }}>
        <span style={{ position: 'absolute', left: `${A * 100}%`, transform: 'translateX(-50%)' }}>5.42</span>
        <span style={{ position: 'absolute', left: `${0.8 * 100}%`, transform: 'translateX(-50%)', opacity: bar > 0.98 ? 1 : 0 }}>5.58</span>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 30, borderTop: `1.5px solid ${C.creamLine}`, paddingTop: 22 }}>
        {stat('Est. CPM', 'Rs 540', false, false, 0)}
        {stat('Max spend', `Rs ${fmtIN(301388 * prog(f, start + 30, 24))}`, false, false, 4)}
        {stat('Creators', String(Math.round(16 * prog(f, start + 30, 18))), true, true, 8)}
      </div>
    </div>
  );
};
