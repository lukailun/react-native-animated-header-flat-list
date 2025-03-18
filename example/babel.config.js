import path from 'path';
import { getConfig } from 'react-native-builder-bob/babel-config';
import pkg from '../package.json';

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );
};
