import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { AnchorsMark } from '../AnchorsLogo';
import { Serif } from '../CleoWidget';
import { ZekoPostImage } from '../ZekoPostImage';
import { lerp, pop, prog } from '../anim';
import { BPost } from './posts';

export type BadgeKind = 'review' | 'approved' | 'changes';
const BADGE: Record<BadgeKind, { label: string; fg: string; bg: string }> = {
  review: { label: 'Ready for review', fg: '#2B5FB8', bg: '#E5EDFA' },
  approved: { label: 'Approved', fg: '#17784D', bg: '#DCF3E6' },
  changes: { label: 'Changes requested', fg: '#C2410C', bg: '#FFE6D6' },
};

type Props = {
  post: BPost; name: string; photo: string; width?: number; mobile?: number;
  badge?: BadgeKind; badgeAt?: number; changeCount?: number;
  showTags?: boolean; enterAt?: number; pressRequestAt?: number; pressApproveAt?: number; approvePulse?: boolean;
  /** render line 2 with a soft highlight (revised text) */
  highlightLine?: number; noEnter?: boolean; style?: React.CSSProperties;
};

const Action: React.FC<{ label: string; path: string }> = ({ label, path }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5b6672', fontSize: 24, fontWeight: 600 }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b6672" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>{label}
  </div>
);

export const DraftWidget: React.FC<Props> = ({
  post, name, photo, width = 1000, mobile = 0, badge = 'review', badgeAt = -999, changeCount = 0, showTags = false, enterAt = 0,
  pressRequestAt = -999, pressApproveAt = -999, approvePulse = false, highlightLine, noEnter = false, style,
}) => {
  const f = useCurrentFrame();
  const p = noEnter ? 1 : pop(f, enterAt, 15, 150);
  const bp = pop(f, badgeAt, 11, 200);
  const cardW = lerp(width - 68, 470, mobile);
  const fs = 26;
  const isMobile = mobile > 0.5;
  const b = BADGE[badge];
  const pressA = prog(f, pressApproveAt, 5) * (1 - prog(f, pressApproveAt + 5, 9));
  const pressR = prog(f, pressRequestAt, 5) * (1 - prog(f, pressRequestAt + 5, 9));
  const pulse = approvePulse ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  const changed = badge !== 'review';
  return (
    <div style={{
      width, background: C.cream, borderRadius: 18, padding: '24px 34px 26px', boxSizing: 'border-box', fontFamily: FONT_SANS,
      boxShadow: '0 30px 80px rgba(0,0,0,.5)', opacity: Math.min(1, p * 2), transform: `translateY(${lerp(80, 0, p)}px) scale(${lerp(0.96, 1, p)})`, ...style,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: C.ink, fontWeight: 500 }}>
          <AnchorsMark size={34} /> anchors <span style={{ color: C.inkSoft }}>/</span> CLEO
        </div>
        <div style={{ display: 'flex', background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 14, padding: 5, position: 'relative', fontSize: 26 }}>
          <div style={{ position: 'absolute', top: 5, bottom: 5, left: 5 + mobile * 128, width: 128, background: C.ink, borderRadius: 10 }} />
          <div style={{ width: 128, padding: '7px 0', textAlign: 'center', position: 'relative', color: mobile < 0.5 ? '#fff' : C.inkSoft }}>Desktop</div>
          <div style={{ width: 128, padding: '7px 0', textAlign: 'center', position: 'relative', color: mobile > 0.5 ? '#fff' : C.inkSoft }}>Mobile</div>
        </div>
      </div>
      <div style={{ margin: '4px 0 10px' }}><Serif size={56} italic="preview">Draft </Serif></div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: cardW, background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 16, padding: '20px 24px 0', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Img src={staticFile(photo)} style={{ width: 72, height: 72, borderRadius: 36, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: fs + 2, fontWeight: 700, color: '#111' }}>{name} <span style={{ fontWeight: 400, color: '#666' }}>· 1st</span></div>
              <div style={{ fontSize: 22, color: '#5b6672', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: cardW - 130 }}>{post.headline}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: fs, lineHeight: 1.36, color: '#1a1a1a' }}>
            <div style={isMobile ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}>
              {post.opening.map((l, i) => (
                <div key={i} style={{ marginTop: i ? 6 : 0, background: highlightLine === i ? 'rgba(255,214,120,.45)' : undefined, borderRadius: 6 }}>
                  {l}{i === post.opening.length - 1 && !showTags && <span style={{ color: '#666' }}> ...see more</span>}
                </div>
              ))}
            </div>
            {showTags && !isMobile && <div style={{ color: C.li, marginTop: 6, fontWeight: 600 }}>{post.tags}</div>}
          </div>
          <div style={{ margin: '14px -24px 0' }}><ZekoPostImage {...post.image} width={cardW} height={lerp(150, 140, mobile)} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0 14px' }}>
            <Action label="Like" path="M7 11v9H4v-9zM7 11l4-8c2 0 3 1.5 2.5 3.500L13 9h6a2 2 0 0 1 2 2.300l-1.400 7A2 2 0 0 1 17.600 20H7" />
            <Action label="Comment" path="M4 5h16v11H9l-5 4z" />
            <Action label="Repost" path="M4 11V9a3 3 0 0 1 3-3h11M15 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H6M9 21l-3-3 3-3" />
            {mobile < 0.5 && <Action label="Share" path="M5 12v7h14v-7M12 15V3M8 7l4-4 4 4" />}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18, background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 16, padding: '14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: b.fg, background: b.bg, padding: '8px 14px', borderRadius: 12, transform: `scale(${changed ? lerp(0.8, 1, Math.min(bp, 1.2)) : 1})` }}>{b.label}</div>
          <div style={{ fontSize: 24, color: C.ink }}>Change requests: {changeCount} / 2</div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 24, fontWeight: 600 }}>
          <div style={{ border: `1.5px solid ${C.creamLine}`, color: C.ink, padding: '10px 14px', borderRadius: 12, transform: `scale(${1 - 0.06 * pressR})`, background: pressR > 0 ? '#F1E9DE' : '#fff' }}>Request changes</div>
          <div style={{ background: C.orange, color: '#fff', padding: '10px 20px', borderRadius: 12, transform: `scale(${1 - 0.07 * pressA + 0.03 * pulse})`, boxShadow: `0 0 ${10 + 26 * Math.max(pulse, pressA)}px rgba(232,116,59,${0.25 + 0.4 * Math.max(pulse, pressA)})` }}>Approve</div>
        </div>
      </div>
    </div>
  );
};
