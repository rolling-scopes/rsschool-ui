module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('./configs/webpack.production');
        case 'development':
        default:
            return require('./configs/webpack.development');
    }
};
