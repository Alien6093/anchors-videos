import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame} from 'remotion';
import {callouts, CalloutSeg} from '../timeline';
import {C, FONT, FPS, W} from '../theme';

const OUT = 6;

const Sparkles: React.FC<{age: number; seed: string}> = ({age, seed}) => {
  if (age < 0 || age > 30) return null;
  const n = 10;
  return (
    <svg
      width={900}
      height={300}
      viewBox="-450 -150 900 300"
      style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', overflow: 'visible', pointerEvents: 'none'}}
    >
      {new Array(n).fill(0).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + random(`${seed}-a${i}`) * 0.5;
        const dist = 170 + random(`${seed}-d${i}`) * 140;
        const p = Easing.out(Easing.cubic)(Math.min(1, age / 26));
        const x = Math.cos(ang) * dist * (0.45 + 0.55 * p) * 1.25;
        const y = Math.sin(ang) * dist * 0.42 * (0.45 + 0.55 * p);
        const sz = (10 + random(`${seed}-s${i}`) * 12) * (1 - p * 0.6);
        const op = interpolate(age, [0, 4, 30], [0, 1, 0], {extrapolateRight: 'clamp'});
        const d = `M ${x} ${y - sz} Q ${x} ${y} ${x + sz} ${y} Q ${x} ${y} ${x} ${y + sz} Q ${x} ${y} ${x - sz} ${y} Q ${x} ${y} ${x} ${y - sz} Z`;
        return <path key={i} d={d} fill={i % 3 === 0 ? '#ffd2d3' : C.white} opacity={op} />;
      })}
    </svg>
  );
};

const Pill: React.FC<{seg: CalloutSeg; frame: number}> = ({seg, frame}) => {
  const age = frame - seg.from;
  const sp = spring({
    frame: age,
    fps: FPS,
    config: seg.big ? {damping: 9, stiffness: 170, mass: 0.7} : {damping: 15, stiffness: 190, mass: 0.6},
  });
  const out = interpolate(frame, [seg.to - OUT, seg.to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const scale = (seg.big ? 0.6 + 0.4 * sp : 0.86 + 0.14 * sp) * (1 - 0.05 * out);
  const y = (1 - sp) * (seg.pos === 'bottom' ? 26 : -26) - out * 10;
  const pulse = seg.big ? 0.5 + 0.5 * Math.sin(age / 7) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        ...(seg.pos === 'bottom' ? {bottom: 104} : {top: 30}),
      }}
    >
      <div
        style={{
          position: 'relative',
          transform: `translateY(${y}px) scale(${scale})`,
          opacity: Math.min(1, sp * 2) * (1 - out),
        }}
      >
        {seg.big ? <Sparkles age={age - 3} seed={seg.shot.id} /> : null}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: seg.big ? '20px 40px' : '18px 34px 18px 26px',
            borderRadius: 14,
            background: seg.big ? `linear-gradient(180deg, ${C.redLight} 0%, ${C.red} 100%)` : C.inkSoft,
            color: C.white,
            fontFamily: FONT,
            fontWeight: seg.big ? 800 : 700,
            fontSize: seg.big ? 48 : 40,
            letterSpacing: seg.big ? -0.8 : -0.4,
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            boxShadow: seg.big
              ? `0 14px 44px rgba(0,0,0,0.30), 0 0 ${36 + 26 * pulse}px rgba(238,66,67,${0.55 + 0.25 * pulse})`
              : '0 14px 40px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.06) inset',
          }}
        >
          {seg.big ? null : (
            <div style={{width: 12, height: 12, borderRadius: 6, background: C.red, boxShadow: '0 0 10px rgba(219,36,37,0.9)'}} />
          )}
          {seg.text}
        </div>
      </div>
    </div>
  );
};

export const Callouts: React.FC = () => {
  const frame = useCurrentFrame();
  const active = callouts.filter((c) => frame >= c.from && frame < c.to);
  return (
    <>
      {active.map((c) => (
        <Pill key={c.shot.id} seg={c} frame={frame} />
      ))}
    </>
  );
};
