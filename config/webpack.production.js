const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common');

const extractStyles = new ExtractTextPlugin({ filename: '[name].[chunkhash].css' });

module.exports = webpackMerge(common.config, {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        app: './app/index',
    },
    output: {
        filename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                loader: ['awesome-typescript-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                exclude: [common.localCssModulesPaths],
                use: extractStyles.extract({
                    use: common.globalSassLoaders,
                    fallback: 'style-loader',
                }),
            },
            {
                test: /\.(scss|sass)$/,
                include: [common.localCssModulesPaths],
                use: extractStyles.extract({
                    use: common.localSassLoaders,
                    fallback: 'style-loader',
                }),
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './favicon.ico',
            inject: true,
            minify: {
                collapseWhitespace: true,
                preserveLineBreaks: false,
            },
        }),
        extractStyles,
    ],
});
