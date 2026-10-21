import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS, W, H} from './theme';
import cuts from '../public/cuts.json';

export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={Math.ceil(cuts.duration * FPS)} fps={FPS} width={W} height={H} />
);
