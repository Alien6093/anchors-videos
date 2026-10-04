import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { Creator } from '../lib/data';
import { fmtIN, lerp, parseIN, pop, prog } from './anim';

type Props = {
  creator: Creator;
  enterAt?: number;
  /** ticks follower number up after landing */
  tickFollowers?: boolean;
  hoverButtonAt?: number;
  width?: number;
};

export const CreatorCard: React.FC<Props> = ({ creator, enterAt = 0, tickFollowers = true, hoverButtonAt, width = 500 }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 160);
  const fol = parseIN(creator.followers) * (tickFollowers ? prog(f, enterAt + 4, 22) : 1);
  const hover = hoverButtonAt === undefined ? 0 : prog(f, hoverButtonAt, 6);
  const Stat = ({ v, l }: { v: string; l: string }) => (
    <div><div style={{ fontSize: 30, fontWeight: 600, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</div><div style={{ fontSize: 20, color: C.inkSoft, marginTop: 2 }}>{l}</div></div>
  );
  return (
    <div style={{
      width, boxSizing: 'border-box', background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 20, padding: 24,
      fontFamily: FONT_SANS, opacity: Math.min(1, p * 1.8), transform: `translateY(${lerp(120, 0, p)}px) scale(${lerp(0.94, 1, p)})`,
      boxShadow: '0 8px 24px rgba(60,40,20,.07)',
    }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <Img src={staticFile(creator.photo)} style={{ width: 76, height: 76, borderRadius: 38, objectFit: 'cover', border: `3px solid ${C.creamLine}` }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{creator.name}</div>
          <div style={{ fontSize: 22, color: C.inkSoft, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 340 }}>#{creator.rank} · {creator.location}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
        <Stat v={fmtIN(fol)} l="Followers" />
        <Stat v={String(creator.avgLikes)} l="Avg likes" />
        <Stat v={creator.engagement} l="Engagement" />
      </div>
      <div style={{ borderTop: `1.5px solid ${C.creamLine}`, marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 26, color: C.ink, fontWeight: 500 }}>
        Tagline <span style={{ color: C.red }}>+</span>
      </div>
      <div style={{
        marginTop: 14, border: `1.5px solid ${hover > 0.5 ? C.red : C.creamLine}`, borderRadius: 12, padding: '13px 18px', display: 'flex', justifyContent: 'space-between',
        fontSize: 26, color: C.ink, background: `rgba(214,58,47,${0.07 * hover})`,
      }}>View creator <span style={{ color: C.red, transform: `translateX(${6 * hover}px)` }}>→</span></div>
    </div>
  );
};
