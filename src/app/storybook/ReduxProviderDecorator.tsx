import * as React from 'react';
import { ReduxProvider } from './ReduxProvider';

function ReduxProviderDecorator(props: any) {
    return <ReduxProvider>{props.children}</ReduxProvider>;
}

export { ReduxProviderDecorator };
