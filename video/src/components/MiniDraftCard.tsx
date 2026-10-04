import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from './theme';
import { PostCopy } from './posts';
import { lerp, pop, prog } from './anim';

type Props = {
  post: PostCopy;
  name: string;
  photo: string;
  request: string;
  enterAt?: number;
  badgeAt?: number;
  pulseAt?: number;
  width?: number;
};

/** Compact draft tile used when three drafts are shown side by side. */
export const MiniDraftCard: React.FC<Props> = ({ post, name, photo, request, enterAt = 0, badgeAt = 10, pulseAt = 999, width = 420 }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 170);
  const bp = pop(f, badgeAt, 12, 200);
  const pl = Math.sin(prog(f, pulseAt, 14, (t) => t) * Math.PI);
  return (
    <div style={{
      width, boxSizing: 'border-box', background: C.cream, borderRadius: 18, padding: 22, fontFamily: FONT_SANS, opacity: Math.min(1, p * 2),
      transform: `translateY(${lerp(120, 0, p)}px) scale(${lerp(0.92, 1, p) * (1 + 0.025 * pl)})`, boxShadow: '0 24px 60px rgba(0,0,0,.5)',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Img src={staticFile(photo)} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
        <div style={{ fontSize: 29, fontWeight: 700, color: C.ink }}>{name}</div>
      </div>
      <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.36, color: '#222', height: 98, overflow: 'hidden' }}>{post.lines[0]}</div>
      <div style={{ marginTop: 10, display: 'inline-block', fontSize: 25, fontWeight: 600, color: '#C2410C', background: '#FFE6D6', padding: '7px 18px', borderRadius: 12, transform: `scale(${lerp(0.6, 1, bp)}) translateX(${lerp(-30, 0, Math.min(1, bp))}px)`, opacity: Math.min(1, bp * 2), boxShadow: `0 0 ${30 * pl}px rgba(240,162,74,${0.7 * pl})` }}>Changes requested</div>
      <div style={{ marginTop: 14, borderLeft: `4px solid ${C.orange}`, paddingLeft: 14, fontSize: 25, lineHeight: 1.35, color: C.ink, opacity: prog(f, badgeAt + 6, 8) }}>{request}</div>
    </div>
  );
};
