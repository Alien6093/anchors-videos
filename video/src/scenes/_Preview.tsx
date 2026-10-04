import React from 'react';
import { Composition } from 'remotion';
import { SCENES, sec } from '../lib/timing';
import { SCENE_COMPONENTS } from './index';

export const PreviewRoot: React.FC = () => (
  <>
    {SCENE_COMPONENTS.map((C, i) => {
      const sc = SCENES[i];
      return <Composition key={sc.id} id={`S${String(sc.id).padStart(2, '0')}`} component={C} durationInFrames={sec(sc.end - sc.start)} fps={30} width={1920} height={1080} />;
    })}
  </>
);
