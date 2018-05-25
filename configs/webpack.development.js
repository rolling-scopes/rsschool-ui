const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = webpackMerge(common.config, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        app: ['react-hot-loader/patch', './app/index'],
    },
    output: {
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                include: [common.localCssModulesPaths],
                use: [{ loader: 'style-loader' }].concat(common.localSassLoaders),
            },
            {
                test: /\.(scss|sass)$/,
                exclude: [common.localCssModulesPaths],
                use: [{ loader: 'style-loader' }].concat(common.globalSassLoaders),
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './favicon.ico',
            inject: true,
        }),
    ],
    optimization: {
        namedModules: true, // NamedModulesPlugin()
    },
    devServer: {
        hot: true,
        port: 3001,
        historyApiFallback: true,
        stats: 'errors-only',
        proxy: {
            '/api/*': {
                // target: `http://ec2-35-158-140-161.eu-central-1.compute.amazonaws.com`,
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
                ws: true,
            },
        },
    },
});
