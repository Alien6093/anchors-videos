import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { CREATORS } from '../../lib/data';
import { ZekoPostImage } from '../ZekoPostImage';
import { fmtIN, lerp, prog, easeOut } from '../anim';

const ORDER = ['ashish', 'riya', 'gunjan', 'shubhangi', 'jyoti', 'sunidhi', 'priyanshu', 'darika'];
const TITLES = ['Evidence over gut feel', 'Structured interviews', 'Resume first. Evidence next.', 'Proof behind every hire'];

const TeaserCard: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const c = CREATORS.find((x) => x.key === ORDER[i])!;
  const t = i / 7 - 0.5;
  const p = prog(f, 2 + i * 2.5, 20);
  const settle = prog(f, 0, 48, (x) => x);
  const x = 960 + t * 1560;
  const y = 740 + Math.pow(t * 2, 2) * 80 + lerp(420, 0, p) - settle * 30;
  const rot = t * 40 * (0.35 + 0.65 * p);
  const sc = lerp(1.6, 1, p) * (1 + 0.05 * settle);
  return (
    <div style={{
      position: 'absolute', left: x - 200, top: y - 180, width: 400, background: '#fff', borderRadius: 16, overflow: 'hidden', fontFamily: FONT_SANS,
      transform: `rotate(${rot}deg) scale(${sc})`, opacity: Math.min(1, p * 2.5), filter: `blur(${(1 - p) * 18}px)`, boxShadow: '0 30px 70px rgba(0,0,0,.6)', zIndex: 10 - Math.round(Math.abs(t) * 10),
    }}>
      <div style={{ display: 'flex', gap: 12, padding: '14px 16px', alignItems: 'center' }}>
        <Img src={staticFile(c.photo)} style={{ width: 56, height: 56, borderRadius: 28, objectFit: 'cover' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>{c.name}</div>
          <div style={{ fontSize: 17, color: '#5b6672', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 290 }}>{c.tagline}</div>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ height: 10, borderRadius: 5, background: '#e6e9ee', marginBottom: 8 }} />
        <div style={{ height: 10, borderRadius: 5, background: '#e6e9ee', width: '70%' }} />
      </div>
      <ZekoPostImage title={TITLES[i % 4]} kicker="LinkedIn" hue={230 + i * 6} width={400} height={130} />
      <div style={{ padding: '10px 16px', fontSize: 18, color: '#5b6672', display: 'flex', justifyContent: 'space-between' }}><span>Like  Comment  Repost</span><span>{fmtIN(c.likes)}</span></div>
    </div>
  );
};

/** 0-1.6s teaser: fan of 8 post cards over a blurred counter ticking to 2,80,000. */
export const Teaser: React.FC = () => {
  const f = useCurrentFrame();
  const v = 280000 * prog(f, 3, 40, easeOut);
  const blur = lerp(20, 0, prog(f, 8, 34, (x) => x * x));
  const fade = prog(f, 0, 6);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, #241a18 0%, #0a0a0a 65%)' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 900, fontSize: 320, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums', filter: `blur(${blur}px)`, opacity: fade, textShadow: '0 0 90px rgba(232,116,59,.45)' }}>
        {fmtIN(v)}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 600, fontSize: 40, color: C.muted, opacity: prog(f, 34, 8) }}>impressions</div>
      {ORDER.map((_, i) => <TeaserCard key={i} i={i} />)}
    </div>
  );
};
