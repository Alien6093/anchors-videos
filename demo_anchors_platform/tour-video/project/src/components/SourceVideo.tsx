import React from 'react';
import {Freeze, OffthreadVideo, staticFile} from 'remotion';
import {FPS, SRC_H, SRC_W} from '../theme';

/**
 * Shows the real recording `src` at an exact source time `t` (seconds).
 * The caller computes t = srcIn + localFrame / fps * rate (see sourceTime),
 * so speed ramps, freezes and transition tails are frame-exact. Here we split
 * t into an integer `startFrom` (source frames) plus a sub-frame remainder
 * that is applied through <Freeze>. (Freezing at the absolute source frame
 * would be clamped by Remotion to the composition length, so the integer
 * part must go through startFrom.)
 */
export const SourceVideo: React.FC<{
  src: 1 | 2 | 3;
  t: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({src, t, width = SRC_W, height = SRC_H, style}) => {
  return (
    <Freeze frame={Math.max(0, t * FPS) - Math.floor(Math.max(0, t * FPS))}>
      <OffthreadVideo
        src={staticFile(`src/v${src}.mp4`)}
        startFrom={Math.floor(Math.max(0, t * FPS))}
        muted
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height,
          display: 'block',
          ...style,
        }}
      />
    </Freeze>
  );
};
