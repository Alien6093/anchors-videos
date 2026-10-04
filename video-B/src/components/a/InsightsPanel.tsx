import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { CREATORS } from '../../lib/data';
import { easeOut, prog } from '../anim';

type Props = { insightsAt: number; barsAt: number; campaignRow?: string; topPostsAt?: number; topicsDimAt?: number; extra?: React.ReactNode };

const COUNT_FRAMES = 11;
const BAR_FRAMES = 18;
const BAR_STAGGER = 4;
const DIM_OPACITY = 0.35;
const DIM_FRAMES = 8;

const TOPICS: [string, number][] = [['AI', 40], ['Future of work', 32], ['Business', 28]];

const Stat: React.FC<{ v: number; l: string; at: number; dimAt: number }> = ({ v, l, at, dimAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, COUNT_FRAMES, easeOut);
  const dim = prog(f, dimAt, DIM_FRAMES);
  return (
    <div style={{ flex: 1, opacity: prog(f, at - 2, 4) * (1 - (1 - DIM_OPACITY) * dim) }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: C.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{Math.round(v * p)}</div>
      <div style={{ fontSize: 26, color: C.inkSoft }}>{l}</div>
    </div>
  );
};

/** Creator insights card: dim header, plain "Deep insights" heading, 3 stats, 3 topic bars. */
export const InsightsPanel: React.FC<Props> = ({ insightsAt, barsAt, campaignRow, topPostsAt, topicsDimAt, extra }) => {
  const f = useCurrentFrame();
  const a = CREATORS.find((c) => c.key === 'ashish')!;
  return (
    <div style={{ width: 1100, background: C.cream, borderRadius: 18, padding: '24px 40px 24px', fontFamily: FONT_SANS, boxShadow: '0 30px 80px rgba(0,0,0,.5)', boxSizing: 'border-box' }}>
      <div style={{ opacity: 0.4 - (0.4 - DIM_OPACITY) * prog(f, barsAt, DIM_FRAMES) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Img src={staticFile(a.photo)} style={{ width: 88, height: 88, borderRadius: 44, objectFit: 'cover', border: `3px solid ${C.creamLine}` }} />
          <div>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>Ashish Shukla <span style={{ color: C.inkSoft, fontWeight: 400 }}>· Ahmedabad</span></div>
            <div style={{ fontSize: 28, color: C.inkSoft, marginTop: 4 }}>AI, business and the future of work.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 20, fontSize: 30, color: C.ink }}>
          <span><b>46,795</b> Followers</span><span><b>789</b> Avg likes</span><span><b>1.97%</b> Engagement</span>
        </div>
        {campaignRow && <div style={{ marginTop: 14, fontSize: 26, color: C.inkSoft, borderTop: `1.5px solid ${C.creamLine}`, paddingTop: 12 }}>{campaignRow}</div>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 600, color: C.ink, marginTop: 18, opacity: prog(f, insightsAt - 8, 8) }}>Deep insights</div>
      <div style={{ display: 'flex', gap: 24, marginTop: 12, opacity: 1 }}>
        <Stat v={789} l="Avg likes" at={insightsAt} dimAt={barsAt} />
        <Stat v={118} l="Avg comments" at={insightsAt + 1} dimAt={barsAt} />
        <Stat v={15} l="Avg reposts" at={insightsAt + 2} dimAt={barsAt} />
      </div>
      <div style={{ marginTop: 14, opacity: prog(f, barsAt - 6, 8) * (topicsDimAt === undefined ? 1 : 1 - (1 - DIM_OPACITY) * prog(f, topicsDimAt, DIM_FRAMES)) }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft, marginBottom: 12 }}>Topics</div>
        {TOPICS.map(([t, v], i) => {
          const p = prog(f, barsAt + i * BAR_STAGGER, BAR_FRAMES, easeOut);
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
              <div style={{ width: 230, fontSize: 30, color: C.ink, fontWeight: 500 }}>{t}</div>
              <div style={{ flex: 1, height: 30, borderRadius: 15, background: C.creamLine, overflow: 'hidden' }}>
                <div style={{ width: `${(v / 40) * 100 * p}%`, height: '100%', borderRadius: 15, background: `linear-gradient(90deg, ${C.orange}, ${C.red})` }} />
              </div>
              <div style={{ width: 90, fontSize: 32, fontWeight: 700, color: C.ink, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * p)}%</div>
            </div>
          );
        })}
      </div>
      {topPostsAt !== undefined && (
        <div style={{ marginTop: 16, opacity: 0.4 * prog(f, topPostsAt, 10) }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.inkSoft, marginBottom: 10 }}>Top posts</div>
          {[0.92, 0.78, 0.64].map((w, i) => (
            <div key={i} style={{ height: 14, borderRadius: 7, marginBottom: 10, width: `${w * 100}%`, background: `linear-gradient(100deg, ${C.creamLine} ${(f * 3 + i * 40) % 160 - 30}%, #fff ${(f * 3 + i * 40) % 160}%, ${C.creamLine} ${(f * 3 + i * 40) % 160 + 30}%)` }} />
          ))}
        </div>
      )}
      {extra}
    </div>
  );
};
