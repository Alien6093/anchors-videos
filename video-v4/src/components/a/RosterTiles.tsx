import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { CREATORS } from '../../lib/data';
import { DROPPED } from './NameChips';
import { easeInOut, prog } from '../anim';

const KEPT = ['ashish', 'riya', 'gunjan', 'priyanshu', 'jyoti', 'sunidhi', 'shubhangi', 'darika'];
export const TILE_H = 92;
export const TILE_GAP = 12;
const TILE_W = 236;

const Tile: React.FC<{ i: number; shrink: number; kept: boolean }> = ({ i, shrink, kept }) => {
  const col = i % 4, row = Math.floor(i / 4);
  const name = kept ? CREATORS.find((c) => c.key === KEPT[i])!.name : DROPPED[i - 8];
  const s = 1 - shrink;
  return (
    <div style={{
      position: 'absolute', left: 34 + col * (TILE_W + 20), top: 20 + row * (TILE_H + TILE_GAP), width: TILE_W, height: TILE_H, boxSizing: 'border-box', background: '#fff', border: `1.5px solid ${C.creamLine}`,
      borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontFamily: FONT_SANS, transform: `scale(${s})`, opacity: s, filter: `blur(${shrink * 3}px)`,
    }}>
      {kept ? <Img src={staticFile(CREATORS.find((c) => c.key === KEPT[i])!.photo)} style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover', flex: '0 0 auto' }} />
        : <div style={{ width: 50, height: 50, borderRadius: 25, background: C.creamLine, color: C.inkSoft, fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{name.split(' ').map((w) => w[0]).join('')}</div>}
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.15 }}>{name}</div>
    </div>
  );
};

/** 4x4 roster; the bottom two rows (the 8 removed) shrink out at shrinkAt with 3f stagger. Height collapses to two rows. */
export const RosterTiles: React.FC<{ shrinkAt: number; collapseAt: number }> = ({ shrinkAt, collapseAt }) => {
  const f = useCurrentFrame();
  const col = prog(f, collapseAt, 16, easeInOut);
  const h = 20 + 4 * TILE_H + 3 * TILE_GAP + 20;
  const h2 = 20 + 2 * TILE_H + TILE_GAP + 20;
  return (
    <div style={{ position: 'relative', height: h + (h2 - h) * col }}>
      {Array.from({ length: 16 }, (_, i) => <Tile key={i} i={i} kept={i < 8} shrink={i < 8 ? 0 : prog(f, shrinkAt + (i - 8) * 2.5, 12, easeInOut)} />)}
    </div>
  );
};
