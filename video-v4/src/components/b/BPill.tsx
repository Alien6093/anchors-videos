import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { prog, lerp } from '../anim';

export type BStatus = 'Awaiting live date' | 'Awaiting draft' | 'Draft ready' | 'Changes requested' | 'Approved' | 'Scheduled' | 'Live';

const STYLE: Record<BStatus, { fg: string; bg: string }> = {
  'Awaiting draft': { fg: '#a5a29b', bg: 'rgba(255,255,255,.07)' },
  'Awaiting live date': { fg: '#a5a29b', bg: 'rgba(255,255,255,.07)' },
  'Draft ready': { fg: '#8dbcff', bg: 'rgba(106,168,255,.16)' },
  'Changes requested': { fg: '#f5b25e', bg: 'rgba(240,162,74,.17)' },
  Approved: { fg: '#5ed39d', bg: 'rgba(63,178,127,.18)' },
  Scheduled: { fg: '#c8b4ff', bg: 'rgba(182,156,255,.17)' },
  Live: { fg: '#5ed39d', bg: 'rgba(63,178,127,.2)' },
};

type Props = { status: BStatus; changedAt?: number; size?: number };

/** Pill that flips (rotateX) when `changedAt` passes. */
export const BPill: React.FC<Props> = ({ status, changedAt = -999, size = 25 }) => {
  const f = useCurrentFrame();
  const t = prog(f, changedAt, 10);
  const flipping = f >= changedAt && f < changedAt + 10;
  const s = STYLE[status];
  const glow = flipping ? 1 - t : 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT_SANS, fontWeight: 600, fontSize: size,
      color: s.fg, background: s.bg, borderRadius: 999, padding: '6px 18px', whiteSpace: 'nowrap',
      transform: flipping ? `perspective(400px) rotateX(${lerp(-90, 0, t)}deg) scale(${1 + 0.12 * glow})` : undefined,
      boxShadow: glow > 0 ? `0 0 ${24 * glow}px ${s.fg}55` : undefined,
    }}>
      {status === 'Live' && <span style={{ width: 12, height: 12, borderRadius: 6, background: C.green, boxShadow: `0 0 12px ${C.green}` }} />}
      {status}
    </span>
  );
};
