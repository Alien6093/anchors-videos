import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SERIF } from '../theme';
import { Step, lastChange, lerp, pop, prog, stepAt, typedCount } from '../anim';
import { BStatus as Status, BPill as StatusPill } from './BPill';

export type BoardRow = {
  name: string; enterAt: number; status: Step<Status>[];
  drafts?: Step<string>[]; cr?: Step<string>[]; publish?: Step<string>[];
  typePublish?: { at: number; text: string };
  shimmerUntil?: number; glowAt?: number; dim?: number;
};

type Props = { rows: BoardRow[]; mode?: 'full' | 'dates'; rowH?: number; size?: number; headerAt?: number; dateHead?: string; statusOverrides?: never };

const FULL = [320, 290, 100, 240, 340];
const DATES = [330, 350, 390];

const Val: React.FC<{ steps: Step<string>[]; size: number; color?: string }> = ({ steps, size, color = C.text }) => {
  const f = useCurrentFrame();
  const at = lastChange(steps, f);
  const t = prog(f, at, 9);
  const ch = f >= at && f < at + 9;
  return <span style={{ fontSize: size, color, opacity: ch ? lerp(0.2, 1, t) : 1, transform: ch ? `translateY(${lerp(-10, 0, t)}px)` : undefined, display: 'inline-block' }}>{stepAt(steps, f)}</span>;
};

export const Board: React.FC<Props> = ({ rows, mode = 'full', rowH = 58, size = 26, headerAt = 0, dateHead = 'Publish date' }) => {
  const f = useCurrentFrame();
  const cols = mode === 'full' ? FULL : DATES;
  const head = mode === 'full' ? ['Creator', 'Status', 'Drafts', 'Change requests', dateHead] : ['Creator', 'Status', dateHead];
  const width = cols.reduce((a, b) => a + b, 0);
  return (
    <div style={{ width, border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', fontFamily: FONT_SERIF, background: 'rgba(255,255,255,.015)', opacity: prog(f, headerAt, 8) }}>
      <div style={{ display: 'flex', height: rowH + 4, alignItems: 'center', background: '#2a2927', borderBottom: `1.5px solid ${C.border}`, padding: '0 22px', boxSizing: 'border-box' }}>
        {head.map((h, i) => <div key={h} style={{ width: cols[i] - (i === 0 ? 22 : 0), fontSize: size, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{h}</div>)}
      </div>
      {rows.map((r, i) => {
        const p = pop(f, r.enterAt, 16, 170);
        const st = stepAt(r.status, f);
        const glow = r.glowAt === undefined ? 0 : Math.sin(prog(f, r.glowAt, 22, (x) => x) * Math.PI);
        const shim = r.shimmerUntil !== undefined && f < r.shimmerUntil;
        const pub = r.typePublish && f >= r.typePublish.at
          ? <span style={{ fontSize: size, color: '#d9d6ff' }}>{r.typePublish.text.slice(0, typedCount(r.typePublish.text.length, f, r.typePublish.at, 50))}</span>
          : shim
            ? <div style={{ width: 250, height: 18, borderRadius: 9, background: `linear-gradient(100deg, rgba(255,255,255,.06) ${(f * 3) % 140 - 30}%, rgba(255,255,255,.22) ${(f * 3) % 140}%, rgba(255,255,255,.06) ${(f * 3) % 140 + 30}%)` }} />
            : <Val steps={r.publish ?? [{ at: 0, v: '-' }]} size={size} color={st === 'Live' || st === 'Scheduled' ? '#d9d6ff' : C.muted} />;
        const cells: React.ReactNode[] = [
          <span key="n" style={{ fontSize: size, color: C.text, whiteSpace: 'nowrap' }}>{r.name}</span>,
          <StatusPill key="s" status={st} changedAt={lastChange(r.status, f)} size={24} />,
        ];
        if (mode === 'full') {
          cells.push(<Val key="d" steps={r.drafts ?? [{ at: 0, v: '1' }]} size={size} />, <Val key="c" steps={r.cr ?? [{ at: 0, v: '0 / 2' }]} size={size} />);
        }
        cells.push(<span key="p">{pub}</span>);
        return (
          <div key={r.name} style={{
            display: 'flex', height: rowH, alignItems: 'center', padding: '0 22px', boxSizing: 'border-box', borderBottom: i < rows.length - 1 ? `1.5px solid ${C.border}` : undefined,
            opacity: Math.min(1, p * 1.8) * (r.dim ?? 1), transform: `translateY(${lerp(-40, 0, p)}px)`, background: glow > 0 ? `rgba(255,196,84,${0.22 * glow})` : undefined,
          }}>
            {cells.map((c, j) => <div key={j} style={{ width: cols[j] - (j === 0 ? 22 : 0) }}>{c}</div>)}
          </div>
        );
      })}
    </div>
  );
};

export const boardWidth = (mode: 'full' | 'dates') => (mode === 'full' ? FULL : DATES).reduce((a, b) => a + b, 0);
