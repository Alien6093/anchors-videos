import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { FORMATS, Format, SRC_H, SRC_W } from '../lib/format';
import { coverTransform, cropAt, windowAround } from '../lib/crop';
import { Rect } from '../lib/plan';
import { lerp, prog } from '../lib/anim';
import { C } from '../components/theme';
import { Box, SceneSpec } from './spec';
import { extraBox, mainBox } from './geometry';

const SRC_FILE = 'src/A.mp4';
const CARD_RADIUS = 36;
const PUNCH_FRAMES = 4;
const WHIP_FRAMES = 7;

type MediaProps = { spec: SceneSpec };

/** Muted source segment for the scene; handles speed and freeze like the engine does. */
const Media: React.FC<MediaProps> = ({ spec }) => {
  const speed = spec.speed ?? 1;
  const total = spec.b - spec.a;
  const style: React.CSSProperties = { width: SRC_W, height: SRC_H };
  const src = staticFile(SRC_FILE);
  const endSrc = spec.src + Math.round(total * speed);
  if (spec.freezeSrc === undefined) {
    return <OffthreadVideo src={src} muted startFrom={spec.src} endAt={endSrc + 1} playbackRate={speed} style={style} />;
  }
  const playFrames = Math.min(total, Math.max(1, Math.round((spec.freezeSrc - spec.src) / speed)));
  return (
    <>
      <Sequence durationInFrames={playFrames} layout="none">
        <OffthreadVideo src={src} muted startFrom={spec.src} endAt={spec.freezeSrc + 1} playbackRate={speed} style={style} />
      </Sequence>
      <Sequence from={playFrames} layout="none">
        <Img src={staticFile(`src/freeze/A_${spec.freezeSrc}.png`)} style={style} />
      </Sequence>
    </>
  );
};

const Window: React.FC<{ spec: SceneSpec; rect: Rect; box: Pick<Box, 'w' | 'h'>; style?: React.CSSProperties }> = ({ spec, rect, box, style }) => {
  const t = coverTransform(rect, box.w, box.h);
  return (
    <div style={{ position: 'relative', width: box.w, height: box.h, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SRC_W, height: SRC_H, transformOrigin: '0 0', transform: `translate(${t.tx}px, ${t.ty}px) scale(${t.scale})` }}>
        <Media spec={spec} />
      </div>
    </div>
  );
};

const CARD_SHADOW = '0 40px 90px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.4)';

const Card: React.FC<{ spec: SceneSpec; rect: Rect; box: Box; bare?: boolean }> = ({ spec, rect, box, bare }) => (
  <div style={{
    position: 'absolute', left: box.left, top: box.top, borderRadius: bare ? 0 : CARD_RADIUS, overflow: 'hidden',
    boxShadow: bare ? undefined : CARD_SHADOW, border: bare ? undefined : '1px solid rgba(255,255,255,.12)',
  }}>
    <Window spec={spec} rect={rect} box={box} />
  </div>
);

type Props = { spec: SceneSpec; format: Format; /** scene-local frame */ frame: number };

const transformFor = (spec: SceneSpec, frame: number): { transform: string; filter?: string } => {
  if (spec.transition === 'punch') return { transform: `scale(${lerp(1.05, 1, prog(frame, 0, PUNCH_FRAMES))})` };
  if (spec.transition === 'whip') {
    const p = prog(frame, 0, WHIP_FRAMES);
    return { transform: `translateX(${lerp(180, 0, p)}px) scale(${lerp(1.06, 1, p)})`, filter: `blur(${lerp(14, 0, p)}px)` };
  }
  return { transform: 'none' };
};

/** One EDL segment rendered as hard crop or card-over-blur, in the requested format. */
export const SceneClip: React.FC<Props> = ({ spec, format, frame }) => {
  const f = FORMATS[format];
  const frames = spec.b - spec.a;
  const rect = cropAt(spec.crop, spec.cropTo, frame, frames);
  const box = mainBox(spec, format);
  const fx = transformFor(spec, frame);
  const tf = { ...fx };

  if (spec.view.kind === 'hard') {
    return (
      <AbsoluteFill style={{ background: C.bg, ...tf }}>
        <Window spec={spec} rect={rect} box={{ w: f.width, h: f.height }} />
      </AbsoluteFill>
    );
  }
  const bgRect = windowAround(spec.view.kind === 'blur' ? spec.crop : rect, f.width / f.height);
  const extra = extraBox(spec);
  return (
    <AbsoluteFill style={{ background: C.bg, ...tf }}>
      <div style={{ position: 'absolute', inset: -60, filter: 'blur(38px) brightness(0.5) saturate(1.2)' }}>
        <div style={{ position: 'absolute', left: 60, top: 60 }}>
          <Window spec={spec} rect={bgRect} box={{ w: f.width, h: f.height }} />
        </div>
      </div>
      {spec.view.kind !== 'blur' && <Card spec={spec} rect={rect} box={box} bare={spec.view.kind === 'free'} />}
      {spec.extra && extra && <Card spec={spec} rect={spec.extra.crop} box={extra} />}
    </AbsoluteFill>
  );
};
