const path = require('path');
const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');
const root = process.cwd();

module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('awesome-typescript-loader'),
    });
    config.module.rules.push({
        test: /\.(scss|css)$/,
        use: [
            { loader: 'style-loader' },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    localIdentName: '[local]-[hash:base64:3]',
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    outputStyle: 'expanded',
                },
            },
        ],
    });
    config.plugins.push(new TSDocgenPlugin()); // optional
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = {
        core: path.resolve(root, 'src/app/core'),
    };
    return config;
};
