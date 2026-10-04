import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { CREATORS } from '../../lib/data';
import { easeOut, lerp, pop, prog } from '../anim';

type Props = { creditAt: number; insightsAt: number; barsAt: number; pulseAt: number; campaignRow?: string; topPostsAt?: number };

const TOPICS: [string, number][] = [['AI', 40], ['Future of work', 32], ['Business', 28]];

const Stat: React.FC<{ v: number; l: string; at: number; dim?: number }> = ({ v, l, at, dim = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 24);
  return (
    <div style={{ flex: 1, opacity: prog(f, at - 4, 8) * (1 - 0.6 * dim) }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: C.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{Math.round(v * p)}</div>
      <div style={{ fontSize: 26, color: C.inkSoft }}>{l}</div>
    </div>
  );
};

/** New: creator insights card: header (dim), credit button -> chip, 3 stats, 3 topic bars. */
export const InsightsPanel: React.FC<Props> = ({ creditAt, insightsAt, barsAt, pulseAt, campaignRow, topPostsAt }) => {
  const f = useCurrentFrame();
  const a = CREATORS.find((c) => c.key === 'ashish')!;
  const btn = 1 - prog(f, creditAt, 6);
  const chip = pop(f, creditAt + 2, 11, 200);
  const pulse = f >= pulseAt && f < creditAt ? 0.5 + 0.5 * Math.sin((f - pulseAt) * 0.5) : 0;
  return (
    <div style={{ width: 1100, background: C.cream, borderRadius: 18, padding: '24px 40px 24px', fontFamily: FONT_SANS, boxShadow: '0 30px 80px rgba(0,0,0,.5)', boxSizing: 'border-box' }}>
      <div style={{ opacity: 0.4 }}>
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
      <div style={{ position: 'relative', height: 84, marginTop: 14 }}>
        <div style={{
          position: 'absolute', left: 0, top: 6, fontSize: 30, fontWeight: 600, color: '#fff', background: C.red, borderRadius: 14, padding: '14px 30px', opacity: btn,
          transform: `scale(${1 + 0.05 * pulse - 0.06 * prog(f, creditAt - 3, 3)})`, boxShadow: `0 0 ${34 * pulse}px rgba(214,58,47,.55)`,
        }}>Deep insights · 1 credit</div>
        <div style={{
          position: 'absolute', left: 0, top: 6, display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 600, color: C.ink, background: '#fff', border: `2px solid ${C.orange}`,
          borderRadius: 999, padding: '11px 28px', opacity: Math.min(1, chip * 2), transform: `translateY(${lerp(-60, 0, Math.min(1, chip))}px) scale(${lerp(0.8, 1, Math.min(1, chip))})`,
        }}>
          <span style={{ width: 30, height: 30, borderRadius: 15, background: C.orange, color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
          1 credit used · first view
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 10, opacity: prog(f, insightsAt - 4, 8) }}>
        <Stat v={789} l="Avg likes" at={insightsAt} dim={1} />
        <Stat v={118} l="Avg comments" at={insightsAt + 4} dim={1} />
        <Stat v={15} l="Avg reposts" at={insightsAt + 8} dim={1} />
      </div>
      <div style={{ marginTop: 14, opacity: prog(f, barsAt - 6, 8) }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft, marginBottom: 12 }}>Topics</div>
        {TOPICS.map(([t, v], i) => {
          const p = prog(f, barsAt + i * 3, 30, easeOut);
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
    </div>
  );
};
