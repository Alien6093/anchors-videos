import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { PlacedScene, placeScenes } from '../lib/plan';
import { prog } from '../lib/anim';
import { CapView } from './Type';
import { Bar, ChapterPill } from './Chrome';
import { RingMark, StickerMark } from './marks';
import { srcRectToFrame } from './geometry';
import { HOOK_SLABS, RINGS, STICKERS, captionsFor } from './timeline';
import { scenes916 } from './scenes916';
import { scenes45 } from './scenes45';

const LAST = 1542;
const HARD_IDS = ['h4', 'pj1', 'cr2', 'q2'];
const FLASH_AT_916 = [16, 32, 48];
const FLASH_AT_45 = [35, 48];
const SMASH_FRAMES = 2;
const TEASE_DIM = 0.62;
const TEASE_AT = 1350;
const END_AT = 1414;

const placedFor = (format: Format): readonly PlacedScene[] => placeScenes(format === '916' ? scenes916 : scenes45);
const P916 = placedFor('916');
const P45 = placedFor('45');

/** White 2-frame flash on hook cuts plus the loop flash (last frames fade from white into frame 0's flash). */
const flashOpacity = (f: number, format: Format): number => {
  const cuts = format === '916' ? FLASH_AT_916 : FLASH_AT_45;
  const cut = cuts.reduce((m, c) => (f >= c && f < c + SMASH_FRAMES ? Math.max(m, 0.85 - (f - c) * 0.4) : m), 0);
  const loopIn = f >= LAST - 1 ? (f === LAST ? 1 : 0.7) : 0;
  const first = f < 3 ? 0.9 - f * 0.35 : 0;
  return Math.max(cut, loopIn, first);
};

export const Stage1Overlay: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  const placed = format === '916' ? P916 : P45;
  const caps = captionsFor(format);
  const slabs = format === '916' ? HOOK_SLABS : [];
  const tease = prog(f, TEASE_AT, 16);
  const showBar = f < END_AT;
  const cur = placed.find((s) => f >= s.from && f < s.from + s.frames);
  const isHard = format === '916' && !!cur && HARD_IDS.includes(cur.scene.id);
  return (
    <AbsoluteFill>
      {tease > 0 && f < END_AT && <AbsoluteFill style={{ background: `rgba(0,0,0,${TEASE_DIM * tease})` }} />}
      {isHard && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.72) 0px, rgba(0,0,0,.55) 560px, rgba(0,0,0,0) 760px)' }} />}
      {showBar && <Bar format={format} frame={f} />}
      <ChapterPill format={format} frame={f} />
      {RINGS.map((ring, i) => {
        const p = placed.find((s) => s.scene.id === ring.scene);
        if (!p) return null;
        const a = ring.rel ? p.from + ring.f0 : ring.f0;
        const b = ring.rel ? p.from + ring.f1 : ring.f1;
        if (f < a || f >= b) return null;
        const box = srcRectToFrame(p, format, ring.rect, f);
        return <RingMark key={`${ring.scene}-${i}`} {...box} tone={ring.tone} t={f - a} />;
      })}
      {STICKERS.filter((s) => f >= s.f0 && f < s.f1).map((s) => (
        <StickerMark key={`${s.text}-${s.f0}`} text={s.text} tone={s.tone} format={format} t={f - s.f0} dur={s.f1 - s.f0} />
      ))}
      {[...slabs].filter((c) => f >= c.f0 && f < c.f1).map((c) => <CapView key={c.text} cap={c} format={format} t={f - c.f0} slab />)}
      {caps.filter((c) => f >= c.f0 && f < c.f1).map((c) => <CapView key={c.text} cap={c} format={format} t={f - c.f0} />)}
      {flashOpacity(f, format) > 0 && <AbsoluteFill style={{ background: '#fff', opacity: flashOpacity(f, format) }} />}
    </AbsoluteFill>
  );
};
