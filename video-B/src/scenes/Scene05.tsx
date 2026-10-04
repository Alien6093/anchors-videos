import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, prog, easeInOut, lerp } from '../components';
import { Caption } from '../components/a/kit';
import { WidgetA } from '../components/a/WidgetA';
import { ProjectionPanelA } from '../components/a/PlanPanels';
import { CreatorsBoard } from '../components/a/CreatorsBoard';

const SORT_AT = 95; // 26.17s, sort-swish cue at 26.2

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const sortP = prog(f, SORT_AT, 30, easeInOut);
  const punch = prog(f, 84, 30, easeInOut) * (1 - prog(f, 150, 40, easeInOut));
  const hi = prog(f, SORT_AT - 4, 14) * (1 - prog(f, 165, 20));
  const onCreators = f >= 5;
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale: lerp(1, 1.3, punch), originX: 760, originY: 560 }}>
        <WidgetA activeTab={onCreators ? 'creators' : 'projection'} tabPressAt={0} pressTab="creators">
          {!onCreators && <ProjectionPanelA start={-200} barAt={0} />}
          {onCreators && <CreatorsBoard enterAt={6} sortP={sortP} hi={hi} />}
        </WidgetA>
      </ChatShell>
      <Caption text="Sort them your way." at={14} outAt={86} />
      {f >= 156 && <Caption text="Sort them your way." at={156} />}
    </AbsoluteFill>
  );
};
