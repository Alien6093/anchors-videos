import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, FakeCursor, prog, easeInOut, lerp, pop } from '../components';
import { Caption } from '../components/a/kit';
import { WidgetA } from '../components/a/WidgetA';
import { ProjectionPanelA, SetupPanelA } from '../components/a/PlanPanels';

const TAB_AT = 90; // 18.5s
const LOCK = 165; // 21.5s

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const rise = pop(f, 0, 14, 120);
  const setupO = 1 - prog(f, TAB_AT + 4, 8);
  const projO = prog(f, TAB_AT + 6, 10);
  const pull = lerp(1.12, 1, prog(f, 0, 40, easeInOut));
  const back = prog(f, 202, 23, easeInOut);
  const scale = f < 60 ? pull : lerp(1, 1.15, prog(f, 118, 30, easeInOut)) * lerp(1, 1 / 1.15, back);
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale, originX: f < 60 ? 960 : 760, originY: 620 }}>
        <div style={{ transform: `translateY(${lerp(260, 0, Math.min(1, rise))}px)`, opacity: Math.min(1, rise * 2) }}>
          <WidgetA activeTab={f < TAB_AT + 6 ? 'setup' : 'projection'} tabPressAt={TAB_AT} height={775}>
            <div style={{ position: 'absolute', inset: 0, opacity: setupO }}><SetupPanelA start={14} /></div>
            <div style={{ position: 'absolute', inset: 0, opacity: projO }}>{f >= TAB_AT + 4 && <ProjectionPanelA start={TAB_AT + 6} barAt={44} />}</div>
          </WidgetA>
        </div>
      </ChatShell>
      <FakeCursor keys={[{ f: 60, x: 1200, y: 600 }, { f: 88, x: 1010, y: 240 }]} clicks={[TAB_AT]} />
      <Caption text="The plan builds itself." at={15} outAt={98} />
      <Caption text="Know the reach before you spend." at={105} size={50} />
    </AbsoluteFill>
  );
};
