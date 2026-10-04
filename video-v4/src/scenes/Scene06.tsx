import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, FakeCursor, prog, easeInOut, easeOut, lerp } from '../components';
import { Caption } from '../components/a/kit';
import { WidgetA } from '../components/a/WidgetA';
import { CreatorsBoard } from '../components/a/CreatorsBoard';
import { InsightsPanel } from '../components/a/InsightsPanel';

const CLICK1 = 14; // View creator
const SLIDE = 20; // 30.6s
const CREDIT = 105; // 33.5s
const BARS = 135; // 34.5s

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const slide = prog(f, SLIDE, 24, easeOut);
  const scale = lerp(1, 1.07, prog(f, 0, 225, (t) => t));
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale, originX: 960, originY: 500 }}>
        <div style={{ transform: `translateX(${-90 * slide}px)`, opacity: 1 - 0.7 * slide }}>
          <WidgetA activeTab="creators">
            <CreatorsBoard sortP={1} enterAt={-99} hover={{ key: 'ashish', at: 4 }} />
          </WidgetA>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${(1 - slide) * 1200}px)`, opacity: slide > 0 ? 1 : 0 }}>
          <InsightsPanel creditAt={CREDIT} insightsAt={CREDIT + 6} barsAt={BARS} pulseAt={70} />
        </div>
      </ChatShell>
      <FakeCursor
        keys={[{ f: 0, x: 900, y: 600 }, { f: 12, x: 600, y: 845 }, { f: 50, x: 900, y: 600 }, { f: 82, x: 650, y: 345 }, { f: 104, x: 640, y: 340 }, { f: 130, x: 1150, y: 640 }]}
        clicks={[CLICK1, CREDIT - 1]}
      />
      <Caption text="Go deeper on anyone." at={30} />
    </AbsoluteFill>
  );
};
