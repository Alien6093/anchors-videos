import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {endCard, f, shots, TOTAL_FRAMES} from './timeline';
import {C} from './theme';
import {ShotLayer} from './components/ShotLayer';
import {ChapterChip} from './components/ChapterChip';
import {ProgressBar} from './components/ProgressBar';
import {Callouts} from './components/Callouts';
import {EndCard} from './components/EndCard';
import {useInterFonts} from './fonts';

// Flip to true once public/audio/mix.wav exists (sound designer's mix).
export const HAS_AUDIO = true;

export const Tour: React.FC = () => {
  useInterFonts();
  const endFrom = f(endCard.tIn);
  return (
    <AbsoluteFill style={{backgroundColor: C.base}}>
      {shots.map((s) => (
        <Sequence
          key={s.id}
          from={s.from}
          durationInFrames={s.dur + s.tail}
          name={`${s.id}${s.chapter ? ` · ch${s.chapter}` : ' · hook'}`}
        >
          <ShotLayer shot={s} />
        </Sequence>
      ))}

      <Sequence from={endFrom} durationInFrames={TOTAL_FRAMES - endFrom} name="end card">
        <EndCard />
      </Sequence>

      <ChapterChip />
      <Callouts />
      <ProgressBar />

      {HAS_AUDIO ? <Audio src={staticFile('audio/mix.wav')} /> : null}
    </AbsoluteFill>
  );
};
