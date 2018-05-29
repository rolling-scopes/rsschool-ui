const React = require('react');

module.exports = function createReduxContext() {
    const __stateGetter = jest.fn();
    const __dispatchMock = jest.fn();
    return {
        __stateGetter,
        __dispatchMock,
        connect: (selector, mapDispatch = {}) => Component => props => {
            return React.createElement(Component, {
                ...props,
                ...Object.keys(mapDispatch).reduce(
                    (res, action) => ({
                        ...res,
                        [action]: (...args) => mapDispatch[action](...args)(__dispatchMock, __stateGetter),
                    }),
                    {},
                ),
                ...(selector ? selector(__stateGetter()) : {}),
            });
        },
    };
};
