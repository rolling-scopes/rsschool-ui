const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
};
const localCssModulesPaths = [path.resolve('./src/app/containers'), path.resolve('./src/app/components')];
const localSassLoaders = [
    {
        loader: 'css-loader',
        options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[local]-[hash:base64:3]',
        },
    },
    { loader: 'sass-loader' },
];
const globalSassLoaders = [{ loader: 'css-loader' }, { loader: 'sass-loader' }];

const config = {
    context: paths.src,
    output: {
        path: paths.dist,
        publicPath: '/',
    },
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            components: path.resolve('./src/app/components'),
            core: path.resolve('./src/app/core'),
        },
    },
    plugins: [new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }])],
};

module.exports = {
    config,
    localCssModulesPaths,
    localSassLoaders,
    globalSassLoaders,
};
