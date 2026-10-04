import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { CREATORS } from '../../lib/data';
import { easeInOut, lerp, pop, prog } from '../anim';

export const CARD_W = 500;
export const CARD_H = 240;
const GAP = 32;
const PAD_X = 34;
const TOP = 74;
const LOC: Record<string, string> = { ashish: 'Ahmedabad', riya: 'Mumbai Metropolitan Region', gunjan: 'Delhi', priyanshu: 'New Delhi', jyoti: 'Vadodara' };
const START = ['ashish', 'riya', 'gunjan', 'priyanshu'];
const SORTED = ['priyanshu', 'jyoti', 'ashish', 'riya'];
const ALL = ['ashish', 'riya', 'gunjan', 'priyanshu', 'jyoti'];

const slotXY = (i: number) => ({ x: PAD_X + (i % 2) * (CARD_W + GAP), y: TOP + Math.floor(i / 2) * (CARD_H + 18) });

type Props = { sortP?: number; enterAt?: number; hi?: number; hover?: { key: string; at: number }; sortedLabel?: boolean };

const Card: React.FC<{ k: string; sortP: number; enterAt: number; idx: number; hi: number; hover?: { key: string; at: number } }> = ({ k, sortP, enterAt, idx, hi, hover }) => {
  const f = useCurrentFrame();
  const c = CREATORS.find((x) => x.key === k)!;
  const a = START.indexOf(k);
  const b = SORTED.indexOf(k);
  const e = easeInOut(sortP);
  const enter = pop(f, enterAt + idx * 8, 15, 160);
  let pos;
  let op = Math.min(1, enter * 1.8);
  let extra = 0;
  if (a >= 0 && b >= 0) { const A = slotXY(a), B = slotXY(b); pos = { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e) }; extra = Math.sin(e * Math.PI) * 0.04; }
  else if (a >= 0) { pos = slotXY(a); op *= 1 - e; pos = { x: pos.x, y: pos.y + 60 * e }; }
  else { pos = slotXY(b); op *= prog(sortP, 0.35, 0.5, (t) => t); pos = { x: pos.x, y: pos.y + 50 * (1 - e) }; }
  const hv = hover && hover.key === k ? prog(f, hover.at, 6) : 0;
  const dimStat = lerp(1, 0.3, hi);
  const Stat = ({ v, l, engage }: { v: string; l: string; engage?: boolean }) => (
    <div style={{ opacity: engage ? 1 : dimStat }}>
      <div style={{ fontSize: engage ? lerp(30, 42, hi) : 30, fontWeight: engage && hi > 0.3 ? 800 : 600, color: engage && hi > 0.3 ? C.red : C.ink, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>{v}</div>
      <div style={{ fontSize: 24, color: C.inkSoft }}>{l}</div>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', left: pos.x, top: pos.y + lerp(90, 0, Math.min(1, enter)), width: CARD_W, height: CARD_H, boxSizing: 'border-box', background: '#fff', border: `1.5px solid ${C.creamLine}`, borderRadius: 20, padding: '20px 24px',
      fontFamily: FONT_SANS, opacity: op, transform: `scale(${lerp(0.94, 1, Math.min(1, enter)) + extra})`, boxShadow: '0 8px 24px rgba(60,40,20,.08)',
    }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <Img src={staticFile(c.photo)} style={{ width: 68, height: 68, borderRadius: 34, objectFit: 'cover', border: `3px solid ${C.creamLine}` }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{c.name}</div>
          <div style={{ fontSize: 24, color: C.inkSoft, whiteSpace: 'nowrap' }}>{LOC[k]}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Stat v={c.followers} l="Followers" /><Stat v={String(c.avgLikes)} l="Avg likes" /><Stat v={c.engagement} l="Engagement" engage />
      </div>
      <div style={{ marginTop: 14, border: `1.5px solid ${hv > 0.5 ? C.red : C.creamLine}`, borderRadius: 12, padding: '8px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 26, color: C.ink, background: `rgba(214,58,47,${0.08 * hv})`, opacity: lerp(1, 0.4, hi) }}>
        View creator <span style={{ color: C.red, transform: `translateX(${6 * hv}px)` }}>{'->'}</span>
      </div>
    </div>
  );
};

/** Matched-creators tab body: 4 visible cards + one FLIP re-sort (sortP 0..1). */
export const CreatorsBoard: React.FC<Props> = ({ sortP = 0, enterAt = 0, hi = 0, hover }) => {
  const f = useCurrentFrame();
  const label = sortP > 0.5 ? 'Engagement' : 'Relevance';
  return (
    <div style={{ position: 'relative', height: TOP + 2 * CARD_H + 18 + 28, fontFamily: FONT_SANS }}>
      <div style={{ position: 'absolute', right: PAD_X, top: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 27, color: C.ink, background: '#fff', border: `1.5px solid ${sortP > 0.02 && sortP < 0.98 ? C.red : C.creamLine}`, borderRadius: 999, padding: '8px 22px', opacity: prog(f, enterAt, 10) }}>
        <span style={{ color: C.inkSoft }}>Sort:</span> {label} <span style={{ color: C.red }}>v</span>
      </div>
      <div style={{ position: 'absolute', left: PAD_X, top: 18, fontSize: 27, color: C.inkSoft, opacity: prog(f, enterAt, 10) }}>16 matched for HR audiences</div>
      {ALL.map((k, i) => (k === 'jyoti' && sortP <= 0 ? null : <Card key={k} k={k} sortP={sortP} enterAt={enterAt} idx={i} hi={hi} hover={hover} />))}
    </div>
  );
};
