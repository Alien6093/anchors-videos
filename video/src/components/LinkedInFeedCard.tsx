import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { PostCopy } from './posts';
import { ZekoPostImage } from './ZekoPostImage';
import { fmtIN, lerp, pop, prog } from './anim';

type Props = {
  post: PostCopy;
  name: string;
  photo: string;
  width?: number;
  enterAt?: number;
  /** frame when reactions start bubbling */
  reactAt?: number;
  likes?: number;
  comments?: number;
  style?: React.CSSProperties;
};

const REACTS = [
  { bg: '#378FE9', d: 'M7 11v9H4v-9zM7 11l4-8c2 0 3 1.500 2.500 3.500L13 9h6a2 2 0 0 1 2 2.300l-1.400 7A2 2 0 0 1 17.600 20H7' },
  { bg: '#44712E', d: 'M4 20l4-12 8 8zM14 4v3M19 9h-3M18 3l-2 2' },
  { bg: '#DF704D', d: 'M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z' },
];

const Bubble: React.FC<{ i: number; at: number; width: number }> = ({ i, at, width }) => {
  const f = useCurrentFrame();
  const t = prog(f, at, 40, (x) => x);
  if (t <= 0 || t >= 1) return null;
  const r = REACTS[i % 3];
  const x = 80 + ((i * 97) % (width - 260)) + Math.sin(t * 9 + i) * 16;
  const y = -t * 220;
  const s = Math.min(1, t * 8) * (1 - Math.max(0, t - 0.7) / 0.3 * 0.3);
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 70, width: 52, height: 52, borderRadius: 26, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `translateY(${y}px) scale(${s})`, opacity: 1 - Math.max(0, t - 0.75) / 0.25, boxShadow: '0 6px 18px rgba(0,0,0,.35)', border: '3px solid #fff',
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
    </div>
  );
};

export const LinkedInFeedCard: React.FC<Props> = ({ post, name, photo, width = 800, enterAt = 0, reactAt = 30, likes = 262, comments = 21, style }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 12, 170);
  const n = Math.round(likes * prog(f, reactAt, 50));
  return (
    <div style={{
      position: 'relative', width, background: '#fff', borderRadius: 18, fontFamily: FONT_SANS, boxShadow: '0 40px 90px rgba(0,0,0,.55)',
      opacity: Math.min(1, p * 2), transform: `translateY(${lerp(120, 0, p)}px) scale(${lerp(0.85, 1, p)})`, ...style,
    }}>
      <div style={{ padding: '22px 26px 0', display: 'flex', gap: 16 }}>
        <Img src={staticFile(photo)} style={{ width: 72, height: 72, borderRadius: 36, objectFit: 'cover' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{name} <span style={{ fontWeight: 400, color: '#666' }}>· 1st</span></div>
          <div style={{ fontSize: 22, color: '#5b6672', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: width - 140 }}>{post.headline}</div>
          <div style={{ fontSize: 22, color: '#5b6672', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.green, fontWeight: 700 }}>Just now</span> · Public
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 26px 14px', fontSize: 26, lineHeight: 1.36, color: '#1a1a1a' }}>
        {post.lines.map((l, i) => <div key={i}>{l}</div>)}
        <div style={{ color: C.li, fontWeight: 600, marginTop: 4 }}>{post.tags}</div>
      </div>
      <ZekoPostImage {...post.image} width={width} height={Math.round(width * 0.27)} />
      <div style={{ padding: '14px 26px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#5b6672' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {REACTS.map((r, i) => <span key={i} style={{ width: 30, height: 30, borderRadius: 15, background: r.bg, border: '2.5px solid #fff', marginLeft: i ? -10 : 0, display: 'inline-block' }} />)}
          <span style={{ fontVariantNumeric: 'tabular-nums', marginLeft: 6 }}>{fmtIN(n)}</span>
        </div>
        <span>{Math.round(comments * prog(f, reactAt + 20, 40))} comments</span>
      </div>
      {Array.from({ length: 14 }, (_, i) => <Bubble key={i} i={i} at={reactAt + i * 5} width={width} />)}
    </div>
  );
};
