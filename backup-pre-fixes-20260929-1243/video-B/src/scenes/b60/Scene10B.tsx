import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, FakeCursor } from '../../components';
import { Caption } from '../../components/b/bits';
import { InsightsPanel } from '../../components/a/InsightsPanel';
import { easeOut, lerp, prog } from '../../components/anim';
import { RANK_ROWS } from '../../lib/dataB';
import { RankTable } from '../../components/bm/RankTable';

const CLICK = 12;
const CREDIT = 40;
const BARS = 70;

export const Scene10B: React.FC = () => {
  const f = useCurrentFrame();
  const slide = prog(f, CLICK + 4, 22, easeOut);
  const rowDim: Record<string, number> = {};
  RANK_ROWS.forEach((r) => { rowDim[r.key] = r.key === 'ashish' ? 1 : lerp(0.35, 0.18, slide); });
  return (
    <AbsoluteFill>
      <ChatShell scrollY={-70}>
        <div style={{ marginLeft: -200, transform: `translateX(${-300 * slide}px)`, opacity: 1 - 0.55 * slide }}>
          <RankTable rows={RANK_ROWS} enterAt={-99} flip={1} mix={1} rowDim={rowDim} today={0} showTotals={false} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${(1 - slide) * 1300}px) scale(0.9)`, transformOrigin: 'top left', opacity: slide > 0 ? 1 : 0 }}>
          <InsightsPanel creditAt={CREDIT} insightsAt={CREDIT + 6} barsAt={BARS} pulseAt={24} campaignRow="Campaign: 44,800 impressions · 728 likes · 63 comments · 1.77%" topPostsAt={BARS + 14} />
        </div>
      </ChatShell>
      <FakeCursor
        keys={[{ f: 0, x: 900, y: 620 }, { f: CLICK - 1, x: 470, y: 405 }, { f: 30, x: 470, y: 405 }, { f: CREDIT - 3, x: 640, y: 520 }, { f: 70, x: 1720, y: 520 }]}
        clicks={[CLICK, CREDIT - 1]}
      />
      <Caption text="Open any creator." at={16} out={110} />
    </AbsoluteFill>
  );
};
