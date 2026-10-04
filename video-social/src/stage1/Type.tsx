import React from 'react';
import { Format } from '../lib/format';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';
import { Cap } from './timeline';

const WORD_GAP = 8; // half a beat between words (9:16 kinetic)
const EXIT = 3;
const SLAB_SIZE = 210;
const TOP_916 = 300;
const TOP_45 = 96;

type Props = { cap: Cap; format: Format; /** frames since cap.f0 */ t: number; slab?: boolean };

const STROKE = '0 6px 0 rgba(0,0,0,.85), 0 14px 34px rgba(0,0,0,.6)';

/** 9:16 kinetic type: each word snaps in (scale 120% -> 100%) and exits hard. */
const Kinetic: React.FC<Props> = ({ cap, t, slab }) => {
  const words = cap.text.split(' ');
  const size = slab ? SLAB_SIZE : cap.size ?? 88;
  const dur = cap.f1 - cap.f0;
  if (t > dur - 1) return null;
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: slab ? 330 : TOP_916 + 70, minHeight: slab ? 240 : 190, display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.24}px`, fontFamily: FONT_SANS }}>
      {words.map((w, i) => {
        const start = slab ? 0 : i * WORD_GAP;
        const p = t < start ? 0 : prog(t, start, 2);
        const blur = (1 - p) * 8;
        return (
          <span key={`${w}-${i}`} style={{
            display: 'inline-block', fontSize: size, fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.035em', color: i === cap.accent ? C.orange : '#fff',
            textShadow: STROKE, transform: `scale(${lerp(1.2, 1, p)})`, filter: `blur(${blur}px)`, opacity: t < start ? 0 : t > dur - EXIT ? 0.5 : 1,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/** 4:5 professional headline: sentence case, fade + 8px rise over 6 frames, holds. */
const LIGHT: readonly (readonly [number, number])[] = [[35, 48], [1029, 1093]];

const Headline: React.FC<Props> = ({ cap, t }) => {
  const abs = cap.f0 + t;
  const isLight = LIGHT.some(([a, b]) => abs >= a && abs < b);
  const words = cap.text.split(' ');
  const p = prog(t, 0, 6);
  const out = 1 - prog(t, cap.f1 - cap.f0 - 4, 4);
  const size = cap.size ?? 64;
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: TOP_45, display: 'flex', alignItems: 'flex-start', minHeight: size * 2.3, fontFamily: FONT_SANS, opacity: p * out, transform: `translateY(${(1 - p) * 8}px)` }}>
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: isLight ? C.ink : '#fff', textShadow: isLight ? 'none' : '0 3px 18px rgba(0,0,0,.55)' }}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} style={{ color: i === cap.accent ? C.orange : isLight ? C.ink : '#fff' }}>{w}{i < words.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </div>
  );
};

export const CapView: React.FC<Props> = (p) => (p.format === '916' ? <Kinetic {...p} /> : <Headline {...p} />);
