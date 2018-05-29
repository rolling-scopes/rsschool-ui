import * as React from 'react';

export function createReduxContext() {
    const __stateGetter = jest.fn(); //tslint:disable-line
    const __dispatchMock = jest.fn(); //tslint:disable-line
    return {
        __stateGetter,
        __dispatchMock,
        connect: (selector: any, mapDispatch: any = {}) => (Component: any) => (props: any) => (
            <Component
                {...props}
                {...Object.keys(mapDispatch).reduce(
                    (res, action) => ({
                        ...res,
                        [action]: (...args: any[]) => mapDispatch[action](...args)(__dispatchMock, __stateGetter),
                    }),
                    {},
                )}
                {...(selector ? selector(__stateGetter()) : {})}
            />
        ),
    };
}
