import * as React from 'react';

import { classNames } from 'core/styles';

const cn = classNames(require('./index.scss'));

const LoadingScreen = () => (
    <div className={cn('loading-screen')}>
        <img className={cn('spinner')} src="/assets/images/logo-rsschool3.svg" alt="rsschool-logo" />
    </div>
);

export default LoadingScreen;
