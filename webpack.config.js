module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('./config/webpack.production');
        case 'development':
        default:
            return require('./config/webpack.development');
    }
};
