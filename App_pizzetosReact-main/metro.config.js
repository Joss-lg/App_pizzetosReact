const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: [
      // Evita que Metro vigile carpetas de build nativo de Android (CMake/.cxx)
      new RegExp(
        path.resolve(__dirname, 'android').replace(/\\/g, '\\\\') + '\\\\.*'
      ),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
