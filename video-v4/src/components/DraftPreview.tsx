import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, COLUMN_W, FONT_SANS } from './theme';
import { AnchorsMark } from './AnchorsLogo';
import { Serif } from './CleoWidget';
import { PostCopy } from './posts';
import { ZekoPostImage } from './ZekoPostImage';
import { lerp, pop, prog } from './anim';

export type DraftStatus = 'review' | 'approved' | 'changes';

type Props = {
  post: PostCopy;
  name: string;
  photo: string;
  /** 0 desktop .. 1 mobile */
  mobile?: number;
  status?: DraftStatus;
  statusAt?: number;
  changeCount?: number;
  changeCountAt?: number;
  pressApproveAt?: number;
  pressRequestAt?: number;
  /** highlights Approve button as if hovered/pulsing */
  approvePulse?: boolean;
  enterAt?: number;
  style?: React.CSSProperties;
};

const BADGE: Record<DraftStatus, { label: string; fg: string; bg: string }> = {
  review: { label: 'Ready for review', fg: '#2B5FB8', bg: '#E5EDFA' },
  approved: { label: 'Approved', fg: '#17784D', bg: '#DCF3E6' },
  changes: { label: 'Changes requested', fg: '#C2410C', bg: '#FFE6D6' },
};

const Action: React.FC<{ label: string; path: string }> = ({ label, path }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5b6672', fontSize: 24, fontWeight: 600 }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b6672" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
    {label}
  </div>
);

export const DraftPreview: React.FC<Props> = ({
  post, name, photo, mobile = 0, status = 'review', statusAt = -999, changeCount = 0, changeCountAt = -999,
  pressApproveAt = -999, pressRequestAt = -999, approvePulse = false, enterAt = 0, style,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 150);
  const cardW = lerp(920, 460, mobile);
  const fs = lerp(26, 24, mobile);
  const isMobile = mobile > 0.5;
  const b = BADGE[status];
  const bp = pop(f, statusAt, 11, 200);
  const check = prog(f, statusAt + 3, 10);
  const crp = pop(f, changeCountAt, 14, 180);
  const pressA = prog(f, pressApproveAt, 5) * (1 - prog(f, pressApproveAt + 5, 9));
  const pressR = prog(f, pressRequestAt, 5) * (1 - prog(f, pressRequestAt + 5, 9));
  const pulse = approvePulse ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return (
    <div style={{
      width: COLUMN_W, background: C.cream, borderRadius: 18, padding: '26px 34px 28px', boxSizing: 'border-box', fontFamily: FONT_SANS,
      boxShadow: `0 ${lerp(10, 40, p)}px ${lerp(20, 90, p)}px rgba(0,0,0,.5)`, opacity: Math.min(1, p * 2), transform: `translateY(${lerp(90, 0, p)}px) scale(${lerp(0.95, 1, p)})`, ...style,
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
      <div style={{ margin: '6px 0 12px' }}><Serif size={58} italic="preview">Draft </Serif></div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: cardW, background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 16, padding: '20px 24px 0', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Img src={staticFile(photo)} style={{ width: 72, height: 72, borderRadius: 36, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: fs + 2, fontWeight: 700, color: '#111' }}>{name} <span style={{ fontWeight: 400, color: '#666' }}>· 1st</span></div>
              <div style={{ fontSize: fs - 4, color: '#5b6672', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: cardW - 130 }}>{post.headline}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: fs, lineHeight: 1.36, color: '#1a1a1a' }}>
            <div style={isMobile ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}>
              {post.lines.map((l, i) => <div key={i}>{l}{i === post.lines.length - 1 && <span style={{ color: '#666' }}> ...see more</span>}</div>)}
            </div>
            {!isMobile && <div style={{ color: C.li, marginTop: 4, fontWeight: 600 }}>{post.tags}</div>}
          </div>
          <div style={{ margin: '14px -24px 0' }}>
            <ZekoPostImage {...post.image} width={cardW} height={lerp(165, 150, mobile)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 0 16px' }}>
            <Action label="Like" path="M7 11v9H4v-9zM7 11l4-8c2 0 3 1.5 2.5 3.500L13 9h6a2 2 0 0 1 2 2.300l-1.400 7A2 2 0 0 1 17.600 20H7" />
            <Action label="Comment" path="M4 5h16v11H9l-5 4z" />
            <Action label="Repost" path="M4 11V9a3 3 0 0 1 3-3h11M15 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H6M9 21l-3-3 3-3" />
            {mobile < 0.5 && <Action label="Share" path="M5 12v7h14v-7M12 15V3M8 7l4-4 4 4" />}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 16, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 25, fontWeight: 600, color: b.fg, background: b.bg, padding: '8px 20px', borderRadius: 12,
            transform: `scale(${lerp(1, 1, bp) * (status === 'review' ? 1 : lerp(0.8, 1, Math.min(bp, 1.25)))})`,
          }}>
            {status === 'approved' && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={b.fg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.500 4.500L19 7.500" strokeDasharray="22" strokeDashoffset={22 * (1 - check)} />
              </svg>
            )}
            {b.label}
          </div>
          <div style={{ fontSize: 24, color: C.ink, opacity: changeCount > 0 || status !== 'review' ? Math.min(1, crp * 2) : 1, transform: `translateX(${changeCount > 0 ? lerp(20, 0, crp) : 0}px)` }}>
            Change requests: {changeCount} / 2
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 25, fontWeight: 600 }}>
          <div style={{ border: `1.5px solid ${C.creamLine}`, color: C.ink, padding: '11px 20px', borderRadius: 12, transform: `scale(${1 - 0.06 * pressR})`, background: pressR > 0 ? '#F1E9DE' : '#fff' }}>Request changes</div>
          <div style={{
            background: C.orange, color: '#fff', padding: '11px 28px', borderRadius: 12, transform: `scale(${1 - 0.07 * pressA + 0.03 * pulse})`,
            boxShadow: `0 0 ${10 + 26 * Math.max(pulse, pressA)}px rgba(232,116,59,${0.25 + 0.4 * Math.max(pulse, pressA)})`,
          }}>Approve</div>
        </div>
      </div>
    </div>
  );
};
