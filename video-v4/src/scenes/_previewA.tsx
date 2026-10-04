import React from 'react';
import { Composition } from 'remotion';
import { SCENES, sec } from '../lib/timing';
import { SCENE_COMPONENTS_A } from './indexA';

export const PreviewRootA: React.FC = () => (
  <>
    {Object.entries(SCENE_COMPONENTS_A).map(([id, Comp]) => {
      const sc = SCENES[Number(id) - 1];
      return <Composition key={id} id={`S${String(id).padStart(2, '0')}`} component={Comp} durationInFrames={sec(sc.end - sc.start)} fps={30} width={1920} height={1080} />;
    })}
  </>
);
