import React from 'react';
import { AbsoluteFill, Freeze, Internals, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FORMATS, Format, SRC_H, SRC_W } from '../lib/format';
import { coverTransform, cropAt, windowAround } from '../lib/crop';
import { Rect, Scene, SOURCE_FILES, sceneFrames, sceneSpeed, secToFrame } from '../lib/plan';
import { C } from './theme';

type MediaProps = { scene: Scene };

/** Freeze at the first frame of the enclosing Sequence. Remotion's <Freeze frame={0}> ignores the cumulated offset of outer Sequences, so the absolute frame is used to cancel it. */
const FreezeAtStart: React.FC<{ seqFrom: number; children: React.ReactNode }> = ({ seqFrom, children }) => {
  const local = useCurrentFrame();
  const abs = Internals.Timeline.useTimelinePosition();
  return <Freeze frame={abs - local - seqFrom}>{children}</Freeze>;
};

/** Plays the scene's source segment (muted). Handles speed and freeze. */
const SceneMedia: React.FC<MediaProps> = ({ scene }) => {
  const src = staticFile(SOURCE_FILES[scene.source]);
  const speed = sceneSpeed(scene);
  const total = sceneFrames(scene);
  const startFrom = secToFrame(scene.srcInSec);
  const style: React.CSSProperties = { width: SRC_W, height: SRC_H };
  if (scene.freezeAtSec === undefined) {
    return <OffthreadVideo src={src} muted startFrom={startFrom} endAt={secToFrame(scene.srcOutSec) + 1} playbackRate={speed} style={style} />;
  }
  const playFrames = Math.min(total, Math.max(1, secToFrame((scene.freezeAtSec - scene.srcInSec) / speed)));
  const freezeFrame = secToFrame(scene.freezeAtSec);
  return (
    <>
      <Sequence durationInFrames={playFrames} layout="none">
        <OffthreadVideo src={src} muted startFrom={startFrom} endAt={freezeFrame + 1} playbackRate={speed} style={style} />
      </Sequence>
      <Sequence from={playFrames} layout="none">
        <FreezeAtStart seqFrom={playFrames}>
          <OffthreadVideo src={src} muted startFrom={freezeFrame} endAt={freezeFrame + 2} style={style} />
        </FreezeAtStart>
      </Sequence>
    </>
  );
};

type WindowProps = { scene: Scene; rect: Rect; boxW: number; boxH: number; style?: React.CSSProperties };

/** The source, transformed so `rect` covers a boxW x boxH box. */
const VideoWindow: React.FC<WindowProps> = ({ scene, rect, boxW, boxH, style }) => {
  const t = coverTransform(rect, boxW, boxH);
  return (
    <div style={{ position: 'relative', width: boxW, height: boxH, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SRC_W, height: SRC_H, transformOrigin: '0 0', transform: `translate(${t.tx}px, ${t.ty}px) scale(${t.scale})` }}>
        <SceneMedia scene={scene} />
      </div>
    </div>
  );
};

const CARD_RADIUS = 40;
const CARD_MARGIN = 40;

type Props = { scene: Scene; format: Format; /** scene-local frame */ frame: number };

export const CroppedClip: React.FC<Props> = ({ scene, format, frame }) => {
  const spec = FORMATS[format];
  const frames = sceneFrames(scene);
  const rect = cropAt(scene.crop, scene.cropTo, frame, frames);

  if (scene.layout === 'full-crop') {
    return (
      <AbsoluteFill style={{ background: C.bg }}>
        <VideoWindow scene={scene} rect={rect} boxW={spec.width} boxH={spec.height} />
      </AbsoluteFill>
    );
  }

  // stack-blur: blurred cover background + sharp rounded card centred in the safe region
  const cardW = scene.stack?.cardWidth ?? spec.width - CARD_MARGIN * 2;
  const aspect = rect.w / rect.h;
  const maxCardH = spec.height - spec.safe.top - spec.safe.bottom;
  const cardH = Math.min(cardW / aspect, maxCardH);
  const fitW = Math.min(cardW, cardH * aspect);
  const cardTop = scene.stack?.cardTop ?? spec.safe.top + (maxCardH - cardH) / 2;
  const bgRect = windowAround(rect, spec.width / spec.height);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: 'absolute', inset: -60, filter: `blur(38px) brightness(${scene.stack?.bgBrightness ?? 0.5}) saturate(1.2)` }}>
        <div style={{ position: 'absolute', left: 60, top: 60 }}>
          <VideoWindow scene={scene} rect={bgRect} boxW={spec.width} boxH={spec.height} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: (spec.width - fitW) / 2, top: cardTop, borderRadius: CARD_RADIUS, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.4)', border: `2px solid ${C.border}` }}>
        <VideoWindow scene={scene} rect={rect} boxW={fitW} boxH={cardH} />
      </div>
    </AbsoluteFill>
  );
};

