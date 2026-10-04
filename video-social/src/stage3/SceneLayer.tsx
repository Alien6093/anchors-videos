import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { Format, SRC_H, SRC_W } from '../lib/format';
import { coverTransform, cropAt, lerpRect } from '../lib/crop';
import { Rect, Scene, SOURCE_FILES, sceneFrames, secToFrame } from '../lib/plan';
import { easeInOut, easeOut, lerp, prog } from '../lib/anim';
import { C } from '../components/theme';
import { sceneMeta } from './scenes';
import { NEAR_BLACK, W, H } from './tokens';

const HOP_FRAMES: Record<Format, number> = { '916': 6, '45': 12 };
const BG_RECT: Rect = { x: 0, y: 110, w: 1920, h: 970 };
const CARD_W: Record<Format, number> = { '916': 1080, '45': 920 };
const CARD_RADIUS = 28;
const CARD_CY: Record<Format, number> = { '916': 820, '45': 675 };
/** y (px) below which the card must start when a headline sits above it. */
const CARD_MIN_TOP: Record<Format, number> = { '916': 560, '45': 270 };
const CARD_MAX_BOTTOM: Record<Format, number> = { '916': 1400, '45': 1225 };

const VIDEO_STYLE: React.CSSProperties = { width: SRC_W, height: SRC_H };

const Media: React.FC<{ scene: Scene }> = ({ scene }) => {
  const src = staticFile(SOURCE_FILES[scene.source]);
  const startFrom = secToFrame(scene.srcInSec);
  const video = <OffthreadVideo src={src} muted startFrom={startFrom} style={VIDEO_STYLE} />;
  return scene.freezeAtSec === undefined ? video : <Freeze frame={0}>{video}</Freeze>;
};

type WinProps = { scene: Scene; rect: Rect; boxW: number; boxH: number; style?: React.CSSProperties };

const VideoWindow: React.FC<WinProps> = ({ scene, rect, boxW, boxH, style }) => {
  const t = coverTransform(rect, boxW, boxH);
  return (
    <div style={{ position: 'relative', width: boxW, height: boxH, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SRC_W, height: SRC_H, transformOrigin: '0 0', transform: `translate(${t.tx}px, ${t.ty}px) scale(${t.scale})` }}>
        <Media scene={scene} />
      </div>
    </div>
  );
};

export type Geometry = { readonly w: number; readonly h: number; readonly top: number };

/** Card geometry for a stack-blur rect. `cy` overrides the vertical centre. */
export const cardGeometry = (format: Format, rect: Rect, hasCaption: boolean, cy?: number): Geometry => {
  const aspect = rect.w / rect.h;
  const maxH = 900;
  const h = Math.min(maxH, CARD_W[format] / aspect);
  const w = Math.min(CARD_W[format], h * aspect);
  const centre = cy ?? CARD_CY[format];
  const minCentre = hasCaption ? CARD_MIN_TOP[format] + h / 2 : 0;
  const maxCentre = CARD_MAX_BOTTOM[format] - h / 2;
  const y = Math.min(maxCentre, Math.max(centre, minCentre));
  return { w, h, top: y - h / 2 };
};

type Props = { scene: Scene; prev?: Scene; format: Format; /** scene-local frame */ frame: number };

/** Rect at a frame: eased pan from the previous crop (a "hop"), then the scene's own push. */
const rectAtFrame = (scene: Scene, prev: Scene | undefined, format: Format, frame: number): Rect => {
  const own = cropAt(scene.crop, scene.cropTo, frame, sceneFrames(scene));
  if (!prev || prev.layout !== scene.layout) return own;
  const hop = HOP_FRAMES[format];
  if (frame >= hop) return own;
  const from = cropAt(prev.crop, prev.cropTo, sceneFrames(prev) - 1, sceneFrames(prev));
  const t = prog(frame, 0, hop, format === '916' ? easeOut : easeInOut);
  return lerpRect(from, own, t);
};

const HardScrim: React.FC<{ where: 'top' | 'bottom'; format: Format }> = ({ where, format }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, height: where === 'top' ? 700 : 420, [where]: 0,
    background: `linear-gradient(${where === 'top' ? 180 : 0}deg, rgba(8,7,6,.78) 0%, rgba(8,7,6,.5) 55%, rgba(8,7,6,0) 100%)`,
    display: format ? 'block' : 'none',
  }} />
);

export const SceneLayer: React.FC<Props> = ({ scene, prev, format, frame }) => {
  const meta = sceneMeta(scene.id, format);
  const rect = rectAtFrame(scene, prev, format, frame);
  const w = W;
  const h = H[format];
  // quick settle on hard cuts between different layouts (no interpolation possible)
  const hardCut = !!prev && prev.layout !== scene.layout;
  const settle = hardCut ? lerp(1.06, 1, prog(frame, 0, 6, easeOut)) : 1;
  if (scene.layout === 'full-crop') {
    return (
      <AbsoluteFill style={{ background: C.bg, transform: `scale(${settle})` }}>
        <VideoWindow scene={scene} rect={rect} boxW={w} boxH={h} />
        {meta.caption !== 'none' && <HardScrim where={meta.caption === 'bottom' ? 'bottom' : 'top'} format={format} />}
      </AbsoluteFill>
    );
  }
  const g = cardGeometry(format, rect, meta.caption === 'top', meta.cy);
  return (
    <AbsoluteFill style={{ background: NEAR_BLACK, transform: `scale(${settle})` }}>
      <div style={{ position: 'absolute', inset: -120, filter: 'blur(60px) brightness(0.6) saturate(1.15)' }}>
        <div style={{ position: 'absolute', left: 120, top: 120 }}>
          <VideoWindow scene={scene} rect={BG_RECT} boxW={w} boxH={h} />
        </div>
      </div>
      <div style={{
        position: 'absolute', left: (w - g.w) / 2, top: g.top, width: g.w, height: g.h, borderRadius: CARD_RADIUS, overflow: 'hidden',
        boxShadow: '0 36px 80px rgba(0,0,0,.55), 0 6px 20px rgba(0,0,0,.4)', border: '1.5px solid rgba(255,255,255,.08)',
      }}>
        <VideoWindow scene={scene} rect={rect} boxW={g.w} boxH={g.h} />
      </div>
    </AbsoluteFill>
  );
};

export const SceneLayerAt: React.FC<{ scene: Scene; prev?: Scene; format: Format }> = ({ scene, prev, format }) => {
  const frame = useCurrentFrame();
  return <SceneLayer scene={scene} prev={prev} format={format} frame={frame} />;
};
