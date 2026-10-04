import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COLUMN_W, FONT_SANS } from '../theme';
import { WidgetHeader, Serif, Tab } from '../CleoWidget';
import { prog } from '../anim';

type Props = {
  activeTab: Tab;
  tabCount?: number;
  tabPressAt?: number;
  pressTab?: Tab;
  compact?: boolean;
  /** replace tab count node (odometer) */
  countNode?: React.ReactNode;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const WidgetA: React.FC<Props> = ({ activeTab, tabCount = 16, tabPressAt = -999, pressTab = 'projection', compact, countNode, height, children, style }) => {
  const f = useCurrentFrame();
  const press = prog(f, tabPressAt, 6) * (1 - prog(f, tabPressAt + 6, 10));
  const tabs: { id: Tab; label: React.ReactNode }[] = [
    { id: 'setup', label: 'Setup' },
    { id: 'creators', label: <>Matched creators ({countNode ?? tabCount})</> },
    { id: 'projection', label: 'Projection' },
  ];
  return (
    <div style={{ width: COLUMN_W, height, background: C.cream, borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,.45)', ...style }}>
      <div style={{ background: C.creamHead, padding: compact ? '20px 34px 12px' : '22px 34px 0' }}>
        <WidgetHeader />
        {!compact && <div style={{ marginTop: 10, paddingBottom: 16 }}><Serif size={50} italic="Zeko AI">Campaign plan for </Serif></div>}
      </div>
      <div style={{ display: 'flex', gap: 40, padding: '0 34px', background: C.creamHead, borderTop: `1px solid ${C.creamLine}`, borderBottom: `1px solid ${C.creamLine}`, fontFamily: FONT_SANS }}>
        {tabs.map((t) => {
          const on = t.id === activeTab;
          const pr = t.id === pressTab ? press : 0;
          return (
            <div key={t.id} style={{
              fontSize: 27, padding: '16px 0 13px', borderBottom: `4px solid ${on ? C.red : 'transparent'}`, marginBottom: -1, color: on ? C.red : C.inkSoft, fontWeight: on ? 600 : 400,
              transform: `scale(${1 - 0.05 * pr})`, background: pr > 0 ? `rgba(214,58,47,${0.08 * pr})` : undefined,
            }}>{t.label}</div>
          );
        })}
      </div>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};
