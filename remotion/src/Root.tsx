import React from 'react';
import {Composition} from 'remotion';
import {WaveLight} from './WaveLight';
import {NameField} from './NameField';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WaveLight"
        component={WaveLight}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WaveLightSquare"
        component={WaveLight}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="NameField"
        component={NameField}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
