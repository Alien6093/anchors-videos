import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {camera, Shot, shots, sourceTime} from '../timeline';
import {C, H, SRC_H_CLEAN, SRC_W, W} from '../theme';
import {SourceVideo} from './SourceVideo';
import {FocusMask} from './FocusMask';
import {ClickRipples} from './ClickRipples';
import {HookText} from './HookText';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type TStyle = {
  x: number; // px translate
  scale: number;
  opacity: number;
  blur: number; // isotropic px
  dirBlur: number; // horizontal motion blur px
  bright: number;
};
const IDENT: TStyle = {x: 0, scale: 1, opacity: 1, blur: 0, dirBlur: 0, bright: 1};

/** Incoming / outgoing transition treatment for a shot layer. */
const transitionStyle = (s: Shot, local: number): TStyle => {
  // incoming
  if (local < s.transIn) {
    const p = (local + 1) / (s.transIn + 1);
    const type = s.index === 0 ? 'fade' : s.transition;
    if (type === 'whoosh') {
      const e = Easing.out(Easing.cubic)(p);
      return {...IDENT, x: W * (1 - e), dirBlur: 90 * Math.pow(1 - p, 1.6)};
    }
    if (type === 'zoom') {
      const e = Easing.out(Easing.cubic)(p);
      return {
        ...IDENT,
        scale: 1.45 - 0.45 * e,
        blur: 22 * (1 - e),
        opacity: interpolate(p, [0, 0.55], [0, 1], clamp),
      };
    }
    if (type === 'fade') {
      return {...IDENT, opacity: Easing.inOut(Easing.quad)(p)};
    }
  }
  // outgoing (held last frame under the next shot's transition)
  if (local >= s.dur && s.tail > 0) {
    const q = (local - s.dur + 1) / (s.tail + 1);
    const next = shots[s.index + 1];
    const type = next ? next.transition : 'end';
    const ei = Easing.in(Easing.cubic)(q);
    if (type === 'whoosh')
      return {...IDENT, x: -W * 0.32 * ei, dirBlur: 50 * q, bright: 1 - 0.35 * q};
    if (type === 'zoom')
      return {...IDENT, scale: 1 + 0.3 * ei, blur: 16 * q, bright: 1 - 0.2 * q};
    if (type === 'fade') return {...IDENT, bright: 1 - 0.45 * q};
    if (type === 'end') return {...IDENT, scale: 1 + 0.05 * q, blur: 18 * q};
  }
  return IDENT;
};

export const ShotLayer: React.FC<{shot: Shot}> = ({shot}) => {
  const local = useCurrentFrame();
  const t = sourceTime(shot, local);
  const cam = camera(shot, Math.min(local, shot.dur - 1));
  const ts = transitionStyle(shot, local);

  const vw = SRC_W * cam.s;
  const vh = SRC_H_CLEAN * cam.s;
  const covered =
    cam.tx <= 0.5 && cam.ty <= 0.5 && cam.tx + vw >= W - 0.5 && cam.ty + vh >= H - 0.5;

  const filters: string[] = [];
  if (ts.dirBlur > 0.5) filters.push(`url(#mb-${shot.id})`);
  if (ts.blur > 0.3) filters.push(`blur(${ts.blur.toFixed(2)}px)`);
  if (ts.bright < 0.999) filters.push(`brightness(${ts.bright.toFixed(3)})`);

  return (
    <AbsoluteFill
      style={{
        opacity: ts.opacity,
        transform: `translateX(${ts.x}px) scale(${ts.scale})`,
        transformOrigin: '50% 50%',
        filter: filters.length ? filters.join(' ') : undefined,
        backgroundColor: C.base,
        overflow: 'hidden',
      }}
    >
      {ts.dirBlur > 0.5 ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={`mb-${shot.id}`} x="-10%" y="0%" width="120%" height="100%">
            <feGaussianBlur stdDeviation={`${ts.dirBlur.toFixed(1)} 0`} />
          </filter>
        </svg>
      ) : null}

      {/* Fill: blurred, darkened, scaled-up copy of the same real frame */}
      {!covered ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            filter: 'blur(36px) brightness(0.45) saturate(1.1)',
            transform: 'scale(1.12)',
          }}
        >
          <SourceVideo
            src={shot.src}
            t={t}
            width={SRC_W * (H / SRC_H_CLEAN) * 1.02}
            height={866 * (H / SRC_H_CLEAN) * 1.02}
            style={{left: (W - SRC_W * (H / SRC_H_CLEAN) * 1.02) / 2, top: -10}}
          />
        </div>
      ) : null}

      {/* The real footage, framed by the smart camera */}
      <div
        style={{
          position: 'absolute',
          left: cam.tx,
          top: cam.ty,
          width: vw,
          height: vh,
          overflow: 'hidden',
          boxShadow: covered ? undefined : '0 20px 80px rgba(0,0,0,0.5)',
          borderRadius: covered ? 0 : 10,
        }}
      >
        <SourceVideo
          src={shot.src}
          t={t}
          width={SRC_W * cam.s}
          height={866 * cam.s}
        />
      </div>

      {shot.isHook ? (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(8,8,12,0.55) 0%, rgba(8,8,12,0.72) 60%, rgba(8,8,12,0.88) 100%)',
          }}
        />
      ) : null}

      <FocusMask shot={shot} local={local} cam={cam} />
      <ClickRipples shot={shot} local={local} cam={cam} />
      <HookText shot={shot} local={local} />
    </AbsoluteFill>
  );
};
