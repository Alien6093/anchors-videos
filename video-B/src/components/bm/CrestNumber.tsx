import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../theme';
import { easeInOut, easeOut, lerp, prog } from '../anim';
import { CountFromTo } from './CountFromTo';

type Props = {
  from: number; to: number; fadeInAt: number; rampAt: number; rampDur: number; lockAt: number; pullAt: number;
  pullDur?: number; pullX: number; pullY: number; warm?: boolean; label?: string; ease?: (t: number) => number;
};

/** Full-screen macro number: punches in, counts, locks with a glow, then pulls back into its tile. */
export const CrestNumber: React.FC<Props> = ({ from, to, fadeInAt, rampAt, rampDur, lockAt, pullAt, pullDur = 16, pullX, pullY, warm = false, label = 'Impressions', ease = easeOut }) => {
  const f = useCurrentFrame();
  const inP = prog(f, fadeInAt, 22, easeOut);
  const pull = prog(f, pullAt, pullDur, easeInOut);
  const alpha = prog(f, fadeInAt, 8) * (1 - prog(f, pullAt + pullDur * 0.45, pullDur * 0.55, (t) => t));
  const drift = 1 + 0.04 * prog(f, fadeInAt, pullAt - fadeInAt, (t) => t);
  const scale = lerp(1.3, 1, inP) * drift * lerp(1, 0.3, pull);
  const flash = f >= lockAt && f < lockAt + 26 ? Math.sin(((f - lockAt) / 26) * Math.PI) : 0;
  const rampDone = prog(f, rampAt + rampDur - 6, 6, Easing.linear);
  const glow = warm ? `rgba(232,116,59,${0.25 + 0.6 * flash})` : `rgba(251,247,241,${0.1 + 0.5 * flash})`;
  const ramping = f >= rampAt && f < rampAt + rampDur;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: alpha, transform: `translate(${pullX * pull}px, ${pullY * pull}px) scale(${scale})`, pointerEvents: 'none' }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: 44, color: C.muted, fontWeight: 500, marginBottom: 24 }}>{label}</div>
      <div style={{
        fontFamily: FONT_SANS, fontSize: 320, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        textShadow: `0 10px 80px rgba(0,0,0,.6), 0 0 ${60 + 100 * flash}px ${glow}`, filter: ramping ? `blur(${(1 - rampDone) * 1.5}px)` : undefined,
      }}>
        <CountFromTo from={from} to={to} start={rampAt} duration={rampDur} ease={ease} />
      </div>
    </AbsoluteFill>
  );
};
