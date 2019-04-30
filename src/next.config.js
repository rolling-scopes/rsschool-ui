const withSass = require('@zeit/next-sass');
const path = require('path');
const webpack = require('webpack');
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

const nextConfig = {
  env: {
    RS_HOST: process.env.RS_HOST || 'http://localhost:3000',
    BUILD_VERSION: process.env.BUILD_VERSION || '0.0.0.0.0',
    APP_VERSION: process.env.APP_VERSION,
  },
  webpack: config => {
    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    // config.plugins.push(
    //   new webpack.DefinePlugin(
    //     Object.keys(nextConfig.env).reduce((acc, key) => {
    //       acc['process.env.' + key] = JSON.stringify(nextConfig.env[key]);
    //       return acc;
    //     }, {}),
    //   ),
    // );
    return config;
  },
};

module.exports = withTypescript(withCSS(withSass(nextConfig)));
