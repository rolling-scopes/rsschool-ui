import { classNames } from 'core/styles';
import * as React from 'react';

const cn = classNames(require('./index.scss'));

const Home = (): JSX.Element => {
    return (
        <div className={cn('home-container')}>
            <header className={cn('home-header')}>
                <h1>Welcome to RS School</h1>
            </header>
        </div>
    );
};

export default Home;
