import React from 'react';
import { Composition } from 'remotion';
import { SCENES, sec } from '../lib/timing';
import { SCENE_COMPONENTS_B } from './indexB';

export const PreviewRootB: React.FC = () => (
  <>
    {SCENES.filter((s) => s.id >= 14 && SCENE_COMPONENTS_B[s.id]).map((sc) => (
      <Composition key={sc.id} id={`S${sc.id}`} component={SCENE_COMPONENTS_B[sc.id]} durationInFrames={sec(sc.end - sc.start)} fps={30} width={1920} height={1080} />
    ))}
  </>
);
