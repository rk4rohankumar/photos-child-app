const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'https://photos-child-app.vercel.app/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'PhotosApp',
          filename: 'remoteEntry.js',
          exposes: {
            './PhotosApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
