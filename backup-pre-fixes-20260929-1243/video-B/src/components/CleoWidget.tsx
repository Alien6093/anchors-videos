import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COLUMN_W, FONT_DISPLAY, FONT_SANS } from './theme';
import { AnchorsMark } from './AnchorsLogo';
import { lerp, pop, prog } from './anim';

export type Tab = 'setup' | 'creators' | 'projection';

type Props = {
  activeTab: Tab;
  /** number shown in "Matched creators (n)" */
  tabCount?: number;
  /** frame at which cursor "presses" tab: highlight */
  tabPressAt?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const Serif: React.FC<{ children: React.ReactNode; size: number; italic?: React.ReactNode; color?: string }> = ({ children, size, italic, color = C.ink }) => (
  <span style={{ fontFamily: FONT_DISPLAY, fontSize: size, letterSpacing: '-0.02em', color, lineHeight: 1.1 }}>
    {children}{italic && <em style={{ color: C.red, fontStyle: 'italic' }}>{italic}</em>}
  </span>
);

export const WidgetHeader: React.FC<{ right?: string }> = ({ right = 'Open the full plan' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT_SANS }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: C.ink, fontWeight: 500 }}>
      <AnchorsMark size={34} /> anchors <span style={{ color: C.inkSoft }}>/</span> CLEO
    </div>
    <div style={{ fontSize: 24, color: C.red }}>{right} ↗</div>
  </div>
);

export const CleoWidget: React.FC<Props> = ({ activeTab, tabCount = 16, tabPressAt = -999, height, children, style }) => {
  const f = useCurrentFrame();
  const tabs: { id: Tab; label: string }[] = [
    { id: 'setup', label: 'Setup' },
    { id: 'creators', label: `Matched creators (${tabCount})` },
    { id: 'projection', label: 'Projection' },
  ];
  const press = prog(f, tabPressAt, 6) * (1 - prog(f, tabPressAt + 6, 10));
  return (
    <div style={{
      width: COLUMN_W, height, background: C.cream, borderRadius: 18, overflow: 'hidden', position: 'relative',
      boxShadow: '0 30px 80px rgba(0,0,0,.45)', ...style,
    }}>
      <div style={{ background: C.creamHead, padding: '26px 34px 0' }}>
        <WidgetHeader />
        <div style={{ marginTop: 16, paddingBottom: 22 }}>
          <Serif size={56} italic="Zeko AI">Campaign plan for </Serif>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, padding: '0 34px', background: C.creamHead, borderTop: `1px solid ${C.creamLine}`, borderBottom: `1px solid ${C.creamLine}`, fontFamily: FONT_SANS, position: 'relative' }}>
        {tabs.map((t) => (
          <div key={t.id} style={{
            fontSize: 27, padding: '20px 0 16px', borderBottom: `4px solid ${t.id === activeTab ? C.red : 'transparent'}`, marginBottom: -1, color: t.id === activeTab ? C.red : C.inkSoft, fontWeight: t.id === activeTab ? 600 : 400,
            transform: t.id === 'creators' ? `scale(${1 - 0.05 * press})` : undefined,
            background: t.id === 'creators' && press > 0 ? `rgba(214,58,47,${0.08 * press})` : undefined,
          }}>{t.label}</div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};

type Field = { label: string; value: string; wide?: boolean };
const FIELDS: Field[] = [
  { label: 'Product', value: 'Zeko AI' },
  { label: 'Category', value: 'HRTech' },
  { label: 'Audience', value: 'HR professionals' },
  { label: 'Motive', value: 'Awareness' },
  { label: 'Storyline', value: 'Structured interviews still hide gut decisions', wide: true },
];

export const SetupPanel: React.FC<{ start?: number; stagger?: number }> = ({ start = 0, stagger = 4.5 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ padding: '30px 34px 34px', fontFamily: FONT_SANS }}>
      <div style={{ marginBottom: 24 }}><Serif size={44} italic="setup">The </Serif></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 26 }}>
        {FIELDS.map((fl, i) => {
          const p = pop(f, start + i * stagger, 16, 170);
          return (
            <div key={fl.label} style={{ width: fl.wide ? '100%' : '50%', opacity: Math.min(1, p * 1.8), transform: `translateY(${lerp(22, 0, p)}px)` }}>
              <div style={{ fontSize: 22, color: C.inkSoft, marginBottom: 6 }}>{fl.label}</div>
              <div style={{ fontSize: 33, color: C.ink, fontWeight: 500 }}>{fl.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
