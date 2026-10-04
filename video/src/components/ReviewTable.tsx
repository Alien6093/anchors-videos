import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SERIF } from './theme';
import { Step, lastChange, lerp, pop, prog, stepAt, typedCount } from './anim';
import { StatusPill, Status } from './StatusPill';

export type ReviewRow = {
  name: string;
  status: Step<Status>[];
  drafts: Step<string>[];
  cr: Step<string>[];
  publish: Step<string>[];
  /** typed-in publish date */
  publishType?: { at: number; text: string };
  /** frame the row drops in */
  enterAt: number;
};

type Props = { rows: ReviewRow[]; width?: number; rowH?: number; headerAt?: number; size?: number };

const COLS = [0.2, 0.185, 0.065, 0.21, 0.34];
const HEAD = ['Creator', 'Status', 'Drafts', 'Change requests used', 'Publish date'];

const Cell: React.FC<{ steps: Step<string>[]; color?: string; size: number; align?: 'left' | 'right' }> = ({ steps, color, size, align }) => {
  const f = useCurrentFrame();
  const v = stepAt(steps, f);
  const at = lastChange(steps, f);
  const t = prog(f, at, 9);
  const changing = f >= at && f < at + 9;
  return (
    <span style={{
      display: 'inline-block', fontSize: size, color: color ?? C.text, textAlign: align,
      opacity: changing ? lerp(0.2, 1, t) : 1, transform: changing ? `translateY(${lerp(-10, 0, t)}px)` : undefined,
    }}>{v}</span>
  );
};

export const ReviewTable: React.FC<Props> = ({ rows, width = 1560, rowH = 60, headerAt = 0, size = 26 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      width, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', fontFamily: FONT_SERIF, background: 'rgba(255,255,255,.015)',
      opacity: prog(f, headerAt, 8),
    }}>
      <div style={{ display: 'flex', height: rowH + 4, alignItems: 'center', background: '#2a2927', borderBottom: `1.5px solid ${C.border}`, padding: '0 22px', boxSizing: 'border-box' }}>
        {HEAD.map((h, i) => (
          <div key={h} style={{ width: `${COLS[i] * 100}%`, fontSize: size, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', textAlign: i === 2 ? 'right' : 'left', paddingRight: i === 2 ? 26 : 0 }}>{h}</div>
        ))}
      </div>
      {rows.map((r, i) => {
        const p = pop(f, r.enterAt, 16, 170);
        const st = stepAt(r.status, f);
        return (
          <div key={r.name} style={{
            display: 'flex', height: rowH, alignItems: 'center', padding: '0 22px', boxSizing: 'border-box',
            borderBottom: i < rows.length - 1 ? `1.5px solid ${C.border}` : undefined,
            opacity: Math.min(1, p * 1.8), transform: `translateY(${lerp(-40, 0, p)}px)`,
          }}>
            <div style={{ width: `${COLS[0] * 100}%`, fontSize: size, color: C.text, whiteSpace: 'nowrap' }}>{r.name}</div>
            <div style={{ width: `${COLS[1] * 100}%` }}><StatusPill status={st} changedAt={lastChange(r.status, f)} /></div>
            <div style={{ width: `${COLS[2] * 100}%`, textAlign: 'right', paddingRight: 26 }}><Cell steps={r.drafts} size={size} align="right" /></div>
            <div style={{ width: `${COLS[3] * 100}%` }}><Cell steps={r.cr} size={size} /></div>
            <div style={{ width: `${COLS[4] * 100}%` }}>
              {r.publishType && f >= r.publishType.at
                ? <span style={{ fontSize: size, color: '#d9d6ff' }}>{r.publishType.text.slice(0, typedCount(r.publishType.text.length, f, r.publishType.at, 44))}</span>
                : <Cell steps={r.publish} size={size} color={st === 'Live' || st === 'Scheduled' ? '#d9d6ff' : C.muted} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
