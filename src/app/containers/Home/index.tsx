import { classNames } from 'core/styles';
import * as React from 'react';

const styles = require('./index.scss');
const cn = classNames(styles);

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
