import * as classnames from 'classnames';
import * as React from 'react';
import { styleNames } from '../../core/styles';

const style = require('./index.scss');
const sn = styleNames(style);

const Home = (): JSX.Element => {
    return (
        <div className={sn('home-container')}>
            <header className="home-header">
                <h1>Welcome to RS School</h1>
            </header>
        </div>
    );
};

export default Home;
