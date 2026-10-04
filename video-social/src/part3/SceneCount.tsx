import React from 'react';
import { prog, easeInOut, lerp } from '../lib/anim';
import { countValue, fmtIN } from './Counter';
import { MorphTiles } from './tiles';

const RAMP_AT = 360;
const RAMP_DUR = 27;
const LOCK_AT = 390;
const MORPH_AT = 450;
const HERO_TOP = 190;

/** f 300-509: hero 1,85,700 held, ramp to 2,80,000, lock on f390 with one glow, then morph into the tile row (final values only). */
export const SceneCount: React.FC<{ f: number }> = ({ f }) => {
  const value = fmtIN(countValue(f, 185700, 280000, RAMP_AT, RAMP_DUR));
  const build = prog(f, 300, 87, (x) => x);
  const pulse = f < RAMP_AT ? 0.04 * Math.sin(((f - 300) / 15) * Math.PI) ** 2 : 0;
  const flare = f >= LOCK_AT ? Math.max(0, 1 - (f - LOCK_AT) / 40) : 0;
  const glow = f < LOCK_AT ? 0.12 + 0.28 * build : 0.4 + 0.6 * flare;
  const punch = f >= LOCK_AT ? Math.max(0, 1 - (f - LOCK_AT) / 8) : 0;
  const hit = f >= LOCK_AT && f < LOCK_AT + 4 ? 0 : 1;
  const m = prog(f, MORPH_AT, 16, easeInOut);
  const g = lerp(glow, 0, m);
  return (
    <MorphTiles
      f={f} m={m} popAt={[462, 470, 478]} heroTop={HERO_TOP} scale={1 + pulse + 0.06 * punch * hit}
      glow={g}
      set={{ impressions: value, likes: '4,500', comments: '361', eng: '1.74%' }}
    />
  );
};
