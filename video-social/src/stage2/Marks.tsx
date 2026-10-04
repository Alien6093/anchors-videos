import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { Rect } from '../lib/plan';
import { cropAt } from '../lib/crop';
import { lerp, pop, prog } from '../lib/anim';
import { Box, SceneSpec, F, beatFrame } from './spec';
import { extraBox, mainBox } from './geometry';
import { ORANGE } from './tokens';

const TICK_X = 1174;
const TICK_YS = [358, 430, 500, 572, 644] as const;
const TICK_BEATS = [37.4, 38.4, 39.4, 40.4, 41.4] as const;
const RING_FRAMES = 14;
const ANGLE_LINE = { x1: 440, x2: 1720, y: 868 } as const;
const ANGLE_FROM = 289;
const ANGLE_TO = 354;

type Mapper = (sx: number, sy: number) => { x: number; y: number } | undefined;

const makeMapper = (crop: Rect, box: Box): Mapper => (sx, sy) => {
  const scale = Math.max(box.w / crop.w, box.h / crop.h);
  const x = box.left + box.w / 2 + (sx - (crop.x + crop.w / 2)) * scale;
  const y = box.top + box.h / 2 + (sy - (crop.y + crop.h / 2)) * scale;
  const inside = x >= box.left && x <= box.left + box.w && y >= box.top && y <= box.top + box.h;
  return inside ? { x, y } : undefined;
};

const mappersFor = (spec: SceneSpec, format: Format, local: number): { mains: Mapper; extra?: Mapper } => {
  const box = mainBox(spec, format);
  const crop = cropAt(spec.crop, spec.cropTo, local, spec.b - spec.a);
  const ex = extraBox(spec);
  return { mains: makeMapper(crop, box), extra: spec.extra && ex ? makeMapper(spec.extra.crop, ex) : undefined };
};

const Ring: React.FC<{ x: number; y: number; t: number; size: number }> = ({ x, y, t, size }) => {
  const p = prog(t, 0, RING_FRAMES);
  const bump = pop(t, 0, 9, 240, 0.5);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, borderRadius: '50%',
      border: `5px solid ${ORANGE}`, opacity: (1 - p) * 0.95, transform: `scale(${lerp(0.7, 1.9, p)})`, boxShadow: `0 0 18px ${ORANGE}`,
    }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `rgba(232,116,59,${0.25 * (1 - p)})`, transform: `scale(${bump})` }} />
    </div>
  );
};

/** Orange ping rings on the five check ticks (scene 8), drawn only where the tick is inside the visible crop. */
const TickPings: React.FC<{ spec: SceneSpec; format: Format }> = ({ spec, format }) => {
  const f = useCurrentFrame();
  if (spec.id.indexOf('review') !== 0) return null;
  const m = mappersFor(spec, format, f - spec.a);
  const map = m.extra ?? m.mains;
  return (
    <>
      {TICK_BEATS.map((beat, i) => {
        const start = beatFrame(beat);
        const t = f - start;
        if (t < 0 || t >= RING_FRAMES) return null;
        const pt = map(TICK_X, TICK_YS[i]);
        return pt ? <Ring key={beat} x={pt.x} y={pt.y} t={t} size={format === '916' ? 64 : 44} /> : null;
      })}
    </>
  );
};

/** Orange underline drawing on under the changed "Angle" line (scene 4). */
const AngleUnderline: React.FC<{ spec: SceneSpec; format: Format }> = ({ spec, format }) => {
  const f = useCurrentFrame();
  if (spec.id.indexOf('angle') !== 0 || f < ANGLE_FROM || f >= ANGLE_TO) return null;
  const m = mappersFor(spec, format, f - spec.a);
  const p0 = m.mains(ANGLE_LINE.x1, ANGLE_LINE.y);
  const p1 = m.mains(ANGLE_LINE.x2, ANGLE_LINE.y);
  if (!p0 || !p1) return null;
  const draw = prog(f, ANGLE_FROM, 10);
  const fade = 1 - prog(f, ANGLE_TO - 6, 6);
  return <div style={{ position: 'absolute', left: p0.x, top: p0.y, width: (p1.x - p0.x) * draw, height: 6, borderRadius: 6, background: ORANGE, boxShadow: `0 0 14px ${ORANGE}`, opacity: fade }} />;
};

/** Gold impact on the "8 of 8" lock: one amber bloom + faint white hit. */
const ImpactFlash: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - F.impact;
  if (t < 0 || t > 14) return null;
  const p = prog(t, 0, 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,214,120,${0.55 * (1 - p)}), transparent 60%)` }} />
      <AbsoluteFill style={{ background: '#fff', opacity: 0.18 * (1 - prog(t, 0, 3)) }} />
    </AbsoluteFill>
  );
};

/** Loop flash: warm glow on frames 0-5 so the seam reads as "next draft arrives". */
const LoopFlash: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 8) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(232,116,59,${0.3 * (1 - prog(f, 0, 8))}), transparent 70%)` }} />;
};

export const Marks: React.FC<{ spec: SceneSpec; format: Format }> = ({ spec, format }) => (
  <>
    <TickPings spec={spec} format={format} />
    <AngleUnderline spec={spec} format={format} />
    <ImpactFlash />
    <LoopFlash />
  </>
);
