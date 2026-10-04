import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { lerp, pop, prog } from '../anim';

type AR = { label: string; v: [number, number | null, number | null] };
export type Panel = { title: string; rows: AR[] };

export const PANELS: Panel[] = [
  { title: 'Roles', rows: [
    { label: 'HR Manager / Talent Acquisition', v: [41, 38, 47] }, { label: 'HR Business Partner', v: [17, 18, 19] }, { label: 'Recruiter', v: [14, 16, 12] },
    { label: 'Founder / CXO', v: [11, 10, 13] }, { label: 'L&D / Other', v: [17, 18, 9] },
  ] },
  { title: 'Locations', rows: [
    { label: 'Delhi NCR', v: [24, 25, 22] }, { label: 'Bengaluru', v: [19, 19, 21] }, { label: 'Mumbai', v: [16, 15, 18] },
    { label: 'Hyderabad', v: [11, 11, 9] }, { label: 'Pune', v: [9, null, null] }, { label: 'Other', v: [21, 30, 30] },
  ] },
  { title: 'Industries', rows: [
    { label: 'IT Services', v: [27, 28, 30] }, { label: 'BFSI', v: [17, 16, 18] }, { label: 'Consulting', v: [14, 14, 15] },
    { label: 'Manufacturing', v: [12, 12, 9] }, { label: 'Healthcare', v: [8, null, null] }, { label: 'Other', v: [22, 30, 28] },
  ] },
  { title: 'Seniority', rows: [
    { label: 'Senior', v: [34, 35, 33] }, { label: 'Manager', v: [29, 28, 32] }, { label: 'Entry', v: [15, 16, 10] },
    { label: 'Director+', v: [13, 12, 15] }, { label: 'CXO / Owner', v: [9, 9, 10] },
  ] },
];

const ROW_H = 76;

/** mode: 0 reached, 1 likers, 2 commenters (continuous). */
export const AudiencePanel: React.FC<{ panel: Panel; mode: number; enterAt: number; emphasis: number; width?: number; rowH?: number; twoState?: boolean; barDelay?: number }> = ({ panel, mode, enterAt, emphasis, width = 428, rowH = ROW_H, twoState = false, barDelay = 10 }) => {
  const f = useCurrentFrame();
  const p = pop(f, enterAt, 15, 160);
  const m = twoState ? 2 * Math.max(0, Math.min(1, mode)) : Math.max(0, Math.min(2, mode));
  const barW = width - 60;
  return (
    <div style={{
      width, boxSizing: 'border-box', background: C.panel, border: `2px solid ${emphasis > 0.9 ? 'rgba(251,247,241,.5)' : C.border}`, borderRadius: 24, padding: '26px 30px 20px', fontFamily: FONT_SANS,
      opacity: Math.min(1, p * 2) * emphasis, transform: `translateY(${lerp(60, 0, p)}px)`, boxShadow: emphasis > 0.9 ? '0 0 60px rgba(251,247,241,.10)' : undefined,
    }}>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{panel.title}</div>
      {panel.rows.map((r, i) => {
        const pres = r.v[1] === null ? lerp(1, 0, Math.min(1, m)) : 1;
        const a = r.v[0], b = r.v[1] ?? 0, c = r.v[2] ?? 0;
        const val = twoState ? lerp(a, c, m / 2) : m <= 1 ? lerp(a, b, m) : lerp(b, c, m - 1);
        const top = i === 0;
        return (
          <div key={r.label} style={{ height: rowH * pres, opacity: pres, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: top ? '#fff' : '#cfcdc7', fontWeight: top ? 600 : 400, whiteSpace: 'nowrap' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: barW - 70 }}>{r.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{Math.round(val)}%</span>
            </div>
            <div style={{ marginTop: 8, height: 16, borderRadius: 8, background: 'rgba(255,255,255,.08)' }}>
              <div style={{ width: `${Math.min(1, prog(f, enterAt + barDelay + i * 4, 18)) * (val / 50) * 100}%`, height: '100%', borderRadius: 8, background: top ? C.cream : '#a9a49a' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TWO_STATE_LABELS = ['Reached', 'Commenters'];

/** labels: pass TWO_STATE_LABELS for the Reached / Commenters toggle (mode 0..1). */
export const ModeToggle: React.FC<{ mode: number; at: number; labels?: string[] }> = ({ mode, at, labels = ['Reached', 'Likers', 'Commenters'] }) => {
  const f = useCurrentFrame();
  const W = 190;
  return (
    <div style={{ display: 'flex', background: '#2a2927', border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 6, position: 'relative', fontFamily: FONT_SANS, fontSize: 28, fontWeight: 600, opacity: prog(f, at, 10) }}>
      <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6 + Math.max(0, Math.min(labels.length - 1, mode)) * W, width: W, background: C.cream, borderRadius: 11 }} />
      {labels.map((l, i) => (
        <div key={l} style={{ width: W, textAlign: 'center', padding: '10px 0', position: 'relative', color: Math.abs(mode - i) < 0.5 ? C.ink : C.muted }}>{l}</div>
      ))}
    </div>
  );
};
