import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {chapters, endCard, f} from '../timeline';
import {C, FONT, FPS, H, SRC_W, W} from '../theme';
import {SourceVideo} from './SourceVideo';

// Background: the real "Campaign Activated" screen (V1), heavily blurred.
const BG = {src: 1 as const, t: 392.6};
const LOGO_SCALE = 3.6;
const RECAP = ['Create', 'Match', 'Brief', 'Launch', 'Approve', 'Measure'];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Real logo crop: the region of the real frame, rendered at LOGO_SCALE via
 * layout size (one resample) plus a mild unsharp convolution. */
const LogoCrop: React.FC = () => {
  const L = endCard.logoSource;
  const k = LOGO_SCALE;
  return (
    <div style={{position: 'relative', width: L.w * k, height: L.h * k, overflow: 'hidden', filter: 'url(#logo-sharpen)'}}>
      <SourceVideo
        src={L.src}
        t={L.t}
        width={SRC_W * k}
        height={866 * k}
        style={{left: -L.x * k, top: -L.y * k}}
      />
    </div>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame(); // local to the end card sequence
  const len = f(endCard.tOut) - f(endCard.tIn);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const toBlack = interpolate(frame, [len - 15, len - 1], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  // slow push-in (~4 %) on the background and the logo/text group
  const pushP = interpolate(frame, [0, len - 1], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const push = 1.04 + 0.04 * pushP;
  const contentPush = 1 + 0.035 * pushP;
  const logo = spring({frame: frame - 6, fps: FPS, config: {damping: 15, stiffness: 120, mass: 0.8}});
  const line = spring({frame: frame - 18, fps: FPS, config: {damping: 20, stiffness: 120}});
  // Only the top BG_ROWS source rows (check mark + headline) fill the frame,
  // so the red "Go to Dashboard" button (src y≈690–740) is never under the tagline.
  const BG_ROWS = 600;
  const bgScale = H / BG_ROWS;

  // tagline: split on the em dash so the brand name can be emphasised
  const [brand, rest] = endCard.text.includes('—')
    ? endCard.text.split(/\s*—\s*/, 2)
    : ['', endCard.text];
  const recap = chapters.length ? RECAP : [];

  return (
    <AbsoluteFill style={{opacity: fadeIn, backgroundColor: '#f4f4f4'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="logo-sharpen">
          <feConvolveMatrix order="3" kernelMatrix="0 -0.45 0 -0.45 2.8 -0.45 0 -0.45 0" preserveAlpha="true" />
        </filter>
      </svg>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${push})`,
            filter: 'blur(30px) saturate(1.15)',
          }}
        >
          <SourceVideo
            src={BG.src}
            t={BG.t}
            width={SRC_W * bgScale}
            height={866 * bgScale}
            style={{left: (W - SRC_W * bgScale) / 2, top: 0}}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 46%, rgba(255,255,255,0.78) 0%, rgba(250,250,250,0.62) 45%, rgba(236,236,238,0.55) 100%)',
        }}
      />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
        <div
          style={{
            transform: `translateY(${(1 - logo) * 30 - 30 * pushP}px) scale(${(0.88 + 0.12 * logo) * contentPush})`,
            opacity: Math.min(1, logo * 1.4),
            marginBottom: 44,
            // the crop's light UI background melts into the light card
            mixBlendMode: 'multiply',
          }}
        >
          <LogoCrop />
        </div>
        <div
          style={{
            transform: `translateY(${(1 - line) * 24}px) scale(${contentPush})`,
            opacity: line,
            fontSize: 50,
            fontWeight: 700,
            letterSpacing: -1,
            color: C.ink,
            textAlign: 'center',
          }}
        >
          {brand ? (
            <>
              <span style={{color: C.red}}>{brand}</span>
              <span style={{color: '#9a9a9a', fontWeight: 500}}> — </span>
            </>
          ) : null}
          {rest}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, transform: `translateY(${16 * pushP}px) scale(${contentPush})`}}>
          {recap.map((wd, i) => {
            const s = spring({frame: frame - 30 - i * 4, fps: FPS, config: {damping: 18, stiffness: 160}});
            return (
              <React.Fragment key={wd}>
                {i > 0 ? (
                  <div style={{width: 8, height: 8, borderRadius: 4, background: C.red, opacity: s}} />
                ) : null}
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: '#3a3a3a',
                    opacity: s,
                    transform: `translateY(${(1 - s) * 14}px)`,
                  }}
                >
                  {wd}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#000', opacity: toBlack}} />
    </AbsoluteFill>
  );
};
