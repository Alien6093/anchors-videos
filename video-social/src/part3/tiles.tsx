import React from 'react';
import { lerp, pop, prog } from '../lib/anim';
import { useLay } from './base';
import { Tile } from './kit';
import { HeroTile } from './Counter';

/** Design-box geometry shared by Day three and Final tiles (Impressions tile on top). */
export const TILE_GEO = {
  imp: { top: 84, h: 212, value: 112 },
  mid: { top: 312, h: 184, value: 84 },
  eng: { top: 512, h: 172, value: 84 },
  gap: 20,
};
export const HERO_GEO = { top: 250, h: 330, value: 168, label: 52 };

export type TileSet = { impressions: string; likes: string; comments: string; eng: string };

/** Impressions morphs hero -> tile (m 0..1); the other three tiles pop in at the given frames with final values only. */
export const MorphTiles: React.FC<{ f: number; m: number; set: TileSet; popAt: [number, number, number]; heroTop?: number; scale?: number; glow?: number }> = ({ f, m, set, popAt, heroTop = HERO_GEO.top, scale = 1, glow = 0 }) => {
  const { dw } = useLay();
  const half = (dw - TILE_GEO.gap) / 2;
  const e = (a: number) => Math.min(1.08, pop(f, a, 13, 190));
  return (
    <>
      <HeroTile
        value={set.impressions} label="Impressions"
        top={lerp(heroTop, TILE_GEO.imp.top, m)} height={lerp(HERO_GEO.h, TILE_GEO.imp.h, m)}
        valueSize={lerp(HERO_GEO.value, TILE_GEO.imp.value, m)} labelSize={lerp(HERO_GEO.label, 44, m)} tile={prog(f, 0, 1) * m} scale={scale} glow={glow}
      />
      {f >= popAt[0] && <Tile top={TILE_GEO.mid.top} left={0} width={half} height={TILE_GEO.mid.h} label="Likes" value={set.likes} valueSize={TILE_GEO.mid.value} appear={e(popAt[0])} />}
      {f >= popAt[1] && <Tile top={TILE_GEO.mid.top} left={half + TILE_GEO.gap} width={half} height={TILE_GEO.mid.h} label="Comments" value={set.comments} valueSize={TILE_GEO.mid.value} appear={e(popAt[1])} />}
      {f >= popAt[2] && <Tile top={TILE_GEO.eng.top} left={0} width={dw} height={TILE_GEO.eng.h} label="Engagement rate" value={set.eng} valueSize={TILE_GEO.eng.value} appear={e(popAt[2])} />}
    </>
  );
};
