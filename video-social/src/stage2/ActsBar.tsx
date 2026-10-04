import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { lerp, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { F } from './spec';
import { ORANGE } from './tokens';

const ACTS = [
  { label: 'BRIEF', a: 64, b: F.actReviewStart },
  { label: 'REVIEW', a: F.actReviewStart, b: F.actApproveStart },
  { label: 'APPROVE', a: F.actApproveStart, b: F.bridge },
] as const;

const BAR_H = 8;
const GAP = 10;
const PULSE_FRAMES = 14;
const POS: Record<Format, { top: number; left: number; w: number }> = {
  '916': { top: 1462, left: 80, w: 920 },
  '45': { top: 1262, left: 80, w: 920 },
};

/** Segmented three-act progress bar: active act fills orange, finished acts turn white; all pulse on the gold impact. */
export const ActsBar: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  const pos = POS[format];
  const show = prog(f, 64, 12) * (1 - prog(f, F.endCard - 10, 10));
  if (show <= 0) return null;
  const segW = (pos.w - GAP * 2) / 3;
  const pulse = prog(f, F.impact, 3) * (1 - prog(f, F.impact + 3, PULSE_FRAMES));
  return (
    <div style={{ position: 'absolute', left: pos.left, top: pos.top, width: pos.w, opacity: show, fontFamily: FONT_SANS }}>
      {ACTS.map((act, i) => {
        const fill = prog(f, act.a, act.b - act.a, (t) => t);
        const done = f >= act.b;
        const active = f >= act.a && !done;
        return (
          <div key={act.label} style={{ position: 'absolute', left: i * (segW + GAP), top: 0, width: segW }}>
            <div style={{ position: 'absolute', top: -34, fontSize: 22, fontWeight: 800, letterSpacing: '0.14em', color: active ? '#fff' : 'rgba(255,255,255,.55)' }}>{act.label}</div>
            <div style={{ position: 'relative', height: BAR_H, borderRadius: BAR_H, background: 'rgba(255,255,255,.2)', transform: `scaleY(${lerp(1, 1.9, pulse)})`, boxShadow: pulse > 0 ? `0 0 ${24 * pulse}px ${ORANGE}` : undefined }}>
              <div style={{ width: `${fill * 100}%`, height: '100%', borderRadius: BAR_H, background: done ? 'rgba(255,255,255,.9)' : ORANGE }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
