import * as React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (): JSX.Element => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/course/bsu-summer-2018/events">Events</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
