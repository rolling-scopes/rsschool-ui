import * as React from 'react';

import { classNames } from 'core/styles';

const cn = classNames(require('./index.scss'));

const LoadingScreen = ({ show = true, ...rest }) => (
    <div className={cn('loading-screen')} style={{ display: show ? 'flex' : 'none', ...rest.style }}>
        <div className={cn('circle', 'circle-1')}>&nbsp;</div>
        <div className={cn('circle', 'circle-2')}>&nbsp;</div>
        <div className={cn('circle', 'circle-3')}>&nbsp;</div>
        <div className={cn('circle', 'circle-4')}>&nbsp;</div>
    </div>
);

export default LoadingScreen;
