import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { easeOut, prog } from '../lib/anim';
import { useFmt } from './ctx';
import { CHIP_END, SPEC, beat } from './tokens';

type PlateDef = { from: number; to: number; sec: number };
/** Blurred, dimmed v4 stills (texture only; blur makes any source text unreadable). */
const PLATES: readonly PlateDef[] = [
  { from: beat(0), to: beat(4), sec: 8.3 },
  { from: beat(4), to: beat(8), sec: 13.0 },
  { from: beat(8), to: beat(12), sec: 17.5 },
  { from: beat(12), to: beat(20), sec: 21.8 },
  { from: beat(20), to: beat(32), sec: 27.4 },
  { from: beat(32), to: beat(44), sec: 38.3 },
  { from: beat(44), to: beat(52), sec: 44.0 },
  { from: beat(52), to: beat(60), sec: 52.5 },
  { from: beat(60), to: beat(64), sec: 67.5 },
  { from: beat(68), to: beat(76), sec: 77.4 },
];

const Plate: React.FC<{ sec: number }> = ({ sec }) => (
  <Freeze frame={0}>
    <OffthreadVideo src={staticFile('src/v4.mp4')} muted startFrom={Math.round(sec * 30)} style={{ position: 'absolute', inset: -120, width: 'calc(100% + 240px)', height: 'calc(100% + 240px)', objectFit: 'cover', filter: 'blur(46px) brightness(0.42) saturate(0.85)' }} />
  </Freeze>
);

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: '#151413' }}>
    {PLATES.map((p) => (
      <Sequence key={p.from} from={p.from} durationInFrames={p.to - p.from} layout="none">
        <Plate sec={p.sec} />
      </Sequence>
    ))}
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,13,12,.62) 0%, rgba(14,13,12,.38) 40%, rgba(14,13,12,.62) 100%)' }} />
  </AbsoluteFill>
);

export const PartChip: React.FC<{ n?: number; label?: string }> = ({ n = 1, label = 'BUILD' }) => {
  const f = useCurrentFrame();
  const { fmt } = useFmt();
  if (f >= CHIP_END) return null;
  const s = SPEC[fmt];
  return (
    <div style={{ position: 'absolute', left: s.chipX, top: s.chipY, display: 'flex', alignItems: 'center', gap: 14, padding: `${s.chipFont * 0.22}px ${s.chipFont * 0.55}px`, borderRadius: 999, background: 'rgba(20,19,18,.78)', border: '2px solid rgba(255,255,255,.28)', fontFamily: FONT_SANS, fontWeight: 800, fontSize: s.chipFont, letterSpacing: '0.07em', color: '#fff', whiteSpace: 'pre', lineHeight: 1, wordSpacing: '0.1em' }}>
      <span>{`PART ${n} / 3`}</span>
      <span style={{ color: C.orange }}>{label}</span>
    </div>
  );
};

/** 4:5 only: small chip beside the part chip during the hook. */
export const HookPill: React.FC = () => {
  const f = useCurrentFrame();
  const { fmt } = useFmt();
  if (fmt !== '45' || f >= beat(4)) return null;
  return (
    <div style={{ position: 'absolute', left: 80 + 420, top: 80, marginLeft: 16, height: 36 * 1.44, display: 'flex', alignItems: 'center', padding: '0 26px', borderRadius: 999, background: 'rgba(232,116,59,.18)', border: `2px solid ${C.orange}`, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 32, color: '#fff', opacity: 0.6 + 0.4 * prog(f, 0, 6, easeOut) }}>
      In one Claude chat
    </div>
  );
};
