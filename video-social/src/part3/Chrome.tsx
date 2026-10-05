import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { lerp, prog } from '../lib/anim';
import { Cap, CAPS_45, CAPS_916 } from './data';
import { DH, useF, useLay } from './base';

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #2b2927 0%, ${C.bg} 62%, #181716 100%)` }} />
);

export const PartChip: React.FC = () => {
  const { chip } = useLay();
  const f = useF();
  const o = 1 - prog(f, 1316, 4, (x) => x);
  return (
    <div style={{
      position: 'absolute', left: chip.x, top: chip.y, display: 'inline-flex', alignItems: 'center', gap: chip.font * 0.4, fontFamily: FONT_SANS, fontWeight: 800, fontSize: chip.font, letterSpacing: '0.06em',
      color: '#fff', background: 'rgba(255,255,255,.07)', border: '2px solid rgba(255,255,255,.22)', borderRadius: 999, padding: `${chip.font * 0.2}px ${chip.font * 0.6}px`, whiteSpace: 'pre', opacity: o,
    }}>
      <span style={{ width: chip.font * 0.3, height: chip.font * 0.3, borderRadius: '50%', background: C.orange }} />
      PART 3 / 3  MONITOR
    </div>
  );
};

const renderLine = (line: string, accent: string): React.ReactNode[] =>
  line.split(/(\*[^*]+\*)/).filter(Boolean).map((seg, i) => (seg.startsWith('*')
    ? <span key={i} style={{ color: accent }}>{seg.slice(1, -1)}</span>
    : <span key={i}>{seg}</span>));

/** Caption (9:16, centred kinetic) / headline (4:5, left) in the band above the card. Present in full on its first frame (108% -> 100% punch). */
export const Caption: React.FC = () => {
  const f = useF();
  const { cap, fmt } = useLay();
  const list: Cap[] = fmt === '916' ? CAPS_916 : CAPS_45;
  const cur = list.find((c) => f >= c.a && f < c.b);
  if (!cur) return null;
  const k = prog(f, cur.a, 6);
  const scale = lerp(1.08, 1, k);
  const centered = fmt === '916';
  return (
    <div style={{ position: 'absolute', left: cap.x, top: cap.y, width: cap.w, height: cap.h, display: 'flex', alignItems: centered ? 'center' : 'flex-start', justifyContent: centered ? 'center' : 'flex-start' }}>
      <div style={{
        fontFamily: FONT_SANS, fontWeight: 800, fontSize: cap.font, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#fff', textAlign: centered ? 'center' : 'left',
        transform: `scale(${scale})`, transformOrigin: centered ? '50% 50%' : '0% 0%', whiteSpace: 'nowrap',
      }}>
        {cur.lines.map((l, i) => <div key={i}>{renderLine(l, C.orange)}</div>)}
      </div>
    </div>
  );
};

/* 9:16 only: keep the card band clear of the Reels/Shorts right-hand button rail (script v2 0.3: no text x>960, y 900-1500). */
const RAIL_SAFE = 0.92;

/** The card frame plus the centred design box (dw x DH) scenes are laid out in. */
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { card, dw, fmt } = useLay();
  const rail = fmt === '916' ? RAIL_SAFE : 1;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${rail})`, transformOrigin: `${card.x}px ${card.y}px` }}>
    <div style={{ position: 'absolute', left: card.x, top: card.y, width: card.w, height: card.h, boxSizing: 'border-box', borderRadius: 44, background: 'linear-gradient(180deg,#2a2927 0%,#242321 100%)', border: `2px solid ${C.border}`, boxShadow: '0 30px 80px rgba(0,0,0,.45)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (card.w - dw) / 2, top: (card.h - DH) / 2, width: dw, height: DH }}>{children}</div>
    </div>
    </div>
  );
};
