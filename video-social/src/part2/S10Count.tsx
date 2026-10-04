import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { Avatar, Cursor, Pill, Stage } from './ui';
import { CounterOf8 } from './Counter';
import { Cap } from './Furniture';
import { useL, useS } from './layout';
import { CREATORS, ORDER_BRIEF } from './tokens';
import { prog, lerp } from '../lib/anim';

const TILE_H = 128;
const GAP = 18;


/** Approve button on a pending tile. */
const ApproveBtn: React.FC<{ press: number }> = ({ press }) => {
  const s = useS();
  return (
    <span style={{ display: 'inline-block', background: C.orange, color: '#fff', fontWeight: 800, fontSize: s(46), padding: `${s(6)}px ${s(26)}px`, borderRadius: s(16), transform: `scale(${1 - 0.1 * press})`, whiteSpace: 'nowrap' }}>Approve</span>
  );
};

const Tile: React.FC<{ k: string; approvedAt: number | null; f: number; press: number }> = ({ k, approvedAt, f, press }) => {
  const s = useS();
  const ok = approvedAt !== null && f >= approvedAt;
  return (
    <div style={{
      height: s(TILE_H), display: 'flex', alignItems: 'center', gap: s(16), padding: `0 ${s(18)}px`, borderRadius: s(26), background: ok ? 'rgba(63,178,127,.12)' : C.panel,
      border: `3px solid ${ok ? 'rgba(63,178,127,.55)' : 'rgba(240,162,74,.6)'}`, minWidth: 0,
    }}>
      <Avatar k={k} size={s(76)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), minWidth: 0 }}>
        <div style={{ fontSize: s(46), fontWeight: 800, color: '#fff', fontFamily: FONT_SANS, lineHeight: 1.05 }}>{CREATORS[k].first}</div>
        {ok ? <Pill status="Approved" since={f - (approvedAt as number)} font={38} /> : <ApproveBtn press={press} />}
      </div>
    </div>
  );
};

const APPROVED_EARLY = ['riya', 'jyoti', 'gunjan', 'shubhangi', 'sunidhi'];

type Props = { f: number; counter: number; counterSince: number; size: number; gold?: boolean; approvedAt: Record<string, number | null>; cursor?: { x: number; y: number; press: number } | null };

const Board: React.FC<Props> = ({ f, counter, counterSince, size, gold, approvedAt, cursor }) => {
  const s = useS();
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: s(size + 30), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: s(22) }}>
        <CounterOf8 n={counter} since={counterSince} size={size} gold={gold} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(GAP) }}>
        {ORDER_BRIEF.map((k) => (
          <Tile key={k} k={k} f={f} approvedAt={APPROVED_EARLY.includes(k) ? -99 : approvedAt[k]} press={cursor && cursor.press > 0 && k === cursorTarget(f) ? cursor.press : 0} />
        ))}
      </div>
      {cursor && <Cursor x={cursor.x} y={cursor.y} size={s(70)} press={cursor.press} />}
    </div>
  );
};

/** Which tile the cursor is currently pressing (local f of scene 10). */
const cursorTarget = (f: number): string => (f < 45 ? 'ashish' : f < 75 ? 'darika' : 'priyanshu');

/** Beat 56-64: counter 5 -> 6 (b58) -> 7 (b60) of 8, cursor rests on the last Approve. */
export const S10Count: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const s = useS();
  // tile geometry for cursor targets (grid of 2 columns; ORDER_BRIEF row-major)
  const gridW = L.inW;
  const tileW = (gridW - s(GAP)) / 2;
  const topOffset = s(140 + 30) + s(22);
  const tilePos = (k: string) => {
    const i = ORDER_BRIEF.indexOf(k);
    return { x: (i % 2) * (tileW + s(GAP)) + tileW - s(150), y: topOffset + Math.floor(i / 2) * (s(TILE_H) + s(GAP)) + s(TILE_H) * 0.55 };
  };
  const a = tilePos('ashish'); const d = tilePos('darika'); const p = tilePos('priyanshu');
  const t1 = prog(f, 0, 24); const t2 = prog(f, 36, 20); const t3 = prog(f, 66, 22);
  let x = lerp(a.x + s(110), a.x, t1); let y = lerp(a.y + s(120), a.y, t1);
  if (f >= 36) { x = lerp(a.x, d.x, t2); y = lerp(a.y, d.y, t2); }
  if (f >= 66) { x = lerp(d.x, p.x, t3); y = lerp(d.y, p.y, t3); }
  const press = (f >= 28 && f < 34) || (f >= 58 && f < 64) ? 1 : 0;
  const n = f >= 60 ? 7 : f >= 30 ? 6 : 5;
  const since = f >= 60 ? f - 60 : f >= 30 ? f - 30 : f + 99;
  return (
    <>
      <Cap f={f} l916={['Re-checked, then', 'approved.']} l45={['Each revision is re-checked', 'before approval.']} acc916="approved." acc45="re-checked" />
      <Stage f={f} noEnter align="top">
        <Board f={f} counter={n} counterSince={since} size={140} approvedAt={{ ashish: 30, darika: 60, priyanshu: null }} cursor={{ x, y, press }} />
      </Stage>
    </>
  );
};

/** Beat 64-70: GOLD. Priyanshu flips, "8 of 8" lands (sole carrier), hold with a slow push. */
export const S11Gold: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f < 4 ? 0.2 * (1 - f / 4) : 0;
  const ring = prog(f, 0, 24);
  return (
    <>
      <Cap f={f} l916={['All approved.']} l45={['Every draft now', 'meets the brief.']} acc916="approved." acc45="meets" />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 38%, rgba(245,196,81,${0.16 * (1 - ring * 0.4)}), transparent 60%)` }} />
      <Stage f={f} noEnter align="top" push={f * 0.00045}>
        <Board f={f} counter={8} counterSince={f} size={190} gold approvedAt={{ ashish: -99, darika: -99, priyanshu: 0 }} />
      </Stage>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(255,236,190,${flash})`, pointerEvents: 'none' }} />
    </>
  );
};
