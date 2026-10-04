import React from 'react';
import { Format } from '../lib/format';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { C, FONT_SANS } from '../components/theme';
import { ACCENT, W } from './tokens';

type Tone = 'cream' | 'green' | 'orange';
const TONES: Record<Tone, { bg: string; fg: string; sub: string }> = {
  cream: { bg: C.cream, fg: C.ink, sub: C.inkSoft },
  green: { bg: C.green, fg: '#fff', sub: 'rgba(255,255,255,.85)' },
  orange: { bg: ACCENT, fg: '#fff', sub: 'rgba(255,255,255,.88)' },
};

type Tag = {
  readonly key: string;
  readonly from: number;
  readonly to: number;
  readonly lines: readonly string[];
  readonly tone: Tone;
  /** y centre per format */
  readonly y: Record<Format, number>;
  readonly tilt?: number;
  readonly arrow?: boolean;
};

const Y = (nine: number, four: number): Record<Format, number> => ({ '916': nine, '45': four });

const TAGS: readonly Tag[] = [
  { key: 'cpm', from: 514, to: 579, lines: ['Rs 525 vs Rs 540 plan'], tone: 'cream', y: Y(690, 1070), tilt: -2, arrow: true },
  { key: 'cpm-chip', from: 546, to: 579, lines: ['Rs 15 below plan'], tone: 'green', y: Y(830, 1190), tilt: 2 },
  { key: 'rank', from: 611, to: 668, lines: ['Darika: 4th to 1st'], tone: 'orange', y: Y(1340, 985), tilt: -2 },
  { key: 'total', from: 691, to: 705, lines: ['Total: 2,80,000'], tone: 'green', y: Y(1340, 985), tilt: 2 },
  { key: 'above', from: 771, to: 836, lines: ['Above range'], tone: 'green', y: Y(1160, 1010), tilt: -3 },
  { key: 'eng', from: 884, to: 946, lines: ['1.77% engagement rate'], tone: 'cream', y: Y(1150, 1000), tilt: -2 },
  { key: 'pub', from: 946, to: 962, lines: ['Published Wed 7 Oct'], tone: 'cream', y: Y(1150, 1000), tilt: 2 },
  { key: 'sent', from: 1014, to: 1100, lines: ['71% positive', '4% negative'], tone: 'cream', y: Y(1140, 985), tilt: -2 },
  { key: 'skew', from: 1284, to: 1348, lines: ['Commenters: 47% HR / TA', 'Likers: 38%'], tone: 'orange', y: Y(1290, 1130), tilt: -2 },
];

const OUT = 5;

const TagView: React.FC<{ tag: Tag; format: Format; frame: number }> = ({ tag, format, frame }) => {
  const local = frame - tag.from;
  const p = pop(local, 0, 10, 210, 0.6);
  const fade = 1 - prog(frame, tag.to - OUT, OUT);
  const tone = TONES[tag.tone];
  const big = format === '916' ? 58 : 46;
  const tilt = lerp(-8, tag.tilt ?? -2, Math.min(1, p));
  return (
    <div style={{
      position: 'absolute', left: W / 2, top: tag.y[format], transform: `translate(-50%, -50%) scale(${lerp(0.4, 1, p)}) rotate(${tilt}deg)`,
      opacity: Math.min(1, p * 3) * fade, fontFamily: FONT_SANS, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        background: tone.bg, color: tone.fg, padding: '20px 40px', borderRadius: 30, textAlign: 'center', lineHeight: 1.08,
        boxShadow: '0 12px 0 rgba(0,0,0,.35), 0 22px 50px rgba(0,0,0,.45)', border: '4px solid #111', maxWidth: 940,
      }}>
        {tag.lines.map((l, i) => (
          <div key={l} style={{ fontSize: i === 0 ? big : big * 0.78, fontWeight: 900, letterSpacing: '-0.025em', color: i === 0 ? tone.fg : tone.sub, whiteSpace: 'nowrap' }}>{l}</div>
        ))}
      </div>
      {tag.arrow && format === '916' && (
        <svg width={70} height={70} viewBox="0 0 64 64" style={{ transform: `translateY(${Math.sin(frame / 5) * 6}px)` }}>
          <path d="M32 6 L32 46 M14 30 L32 50 L50 30" fill="none" stroke="#111" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 6 L32 46 M14 30 L32 50 L50 30" fill="none" stroke={tone.bg} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

const BIG_FROM = 418;
const BIG_TO = 452;

/** Native 2,80,000 at the lock: orange glow, 12-frame 100 -> 108 -> 100 scale. */
const BigNumber: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  if (frame < BIG_FROM || frame >= BIG_TO) return null;
  const local = frame - BIG_FROM;
  const appear = prog(local, 0, 5, easeOut);
  const fade = 1 - prog(frame, BIG_TO - 6, 6);
  const bump = local < 12 ? 1 + 0.08 * Math.sin((local / 12) * Math.PI) : 1;
  const size = format === '916' ? 200 : 150;
  const y = format === '916' ? 1215 : 960;
  return (
    <div style={{
      position: 'absolute', left: 0, width: W, top: y, transform: `translateY(-50%) scale(${bump * lerp(0.92, 1, appear)})`, textAlign: 'center',
      fontFamily: FONT_SANS, opacity: appear * fade,
    }}>
      <div style={{
        fontSize: size, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, color: '#fff',
        textShadow: `0 0 40px ${ACCENT}, 0 0 90px rgba(242,128,58,.55), 0 10px 0 rgba(0,0,0,.35)`,
      }}>2,80,000</div>
      <div style={{ marginTop: 6, fontSize: size * 0.26, fontWeight: 700, color: ACCENT, letterSpacing: '0.02em' }}>impressions</div>
    </div>
  );
};

/** Concentric lock ripples centred on the counter (used at b11). */
const LockRing: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const start = 177;
  const dur = 18;
  if (frame < start || frame >= start + dur) return null;
  const local = frame - start;
  const cy = format === '916' ? 815 : 650;
  return (
    <svg width={W} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
      {[0, 4].map((d) => {
        const t = prog(local, d, dur - d, easeOut);
        return <circle key={d} cx={W / 2} cy={cy} r={lerp(60, 520, t)} fill="none" stroke={ACCENT} strokeWidth={lerp(14, 2, t)} opacity={(1 - t) * 0.9} />;
      })}
    </svg>
  );
};

export const Callouts: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => (
  <>
    <LockRing format={format} frame={frame} />
    <BigNumber format={format} frame={frame} />
    {TAGS.filter((t) => frame >= t.from && frame < t.to).map((t) => (
      <TagView key={t.key} tag={t} format={format} frame={frame} />
    ))}
  </>
);
