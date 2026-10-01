const { ModuleFederationPlugin } = require('webpack').container;
const { dependencies } = require('./package.json');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // The host injects remoteEntry.js from wherever this app is deployed;
      // 'auto' derives the public path from that script URL. Dev keeps '/'.
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.output.publicPath = 'auto';
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'PhotosApp',
          filename: 'remoteEntry.js',
          exposes: {
            './PhotosApp': './src/App',
          },
          shared: {
            react: { singleton: true, requiredVersion: dependencies.react },
            'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
            'framer-motion': { singleton: true, requiredVersion: dependencies['framer-motion'] },
            axios: { singleton: true, requiredVersion: dependencies.axios },
          },
        })
      );
      return webpackConfig;
    },
  },
};
