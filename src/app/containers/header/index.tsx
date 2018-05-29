import { classNames } from 'core/styles';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

const cn = classNames(require('./index.scss'));

const Header = (): JSX.Element => {
    return (
        <nav className={cn('navbar', 'navbar-light', 'header-nav')}>
            <div className="container">
                <a className="navbar-brand" href="index.html">
                    <img
                        className={cn('header-logo')}
                        src="/assets/images/logo-rsschool.svg"
                        alt="Rolling Scopes School Logo"
                    />
                </a>
                <ul className="nav nav-pills justify-content-end">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/home">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/course/bsu-summer-2018/events">
                            Schedule
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/course/bsu-summer-2018/tasks">
                            Tasks
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/profile">
                            Profile
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/me/mentor">
                            My Mentor
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/admin">
                            Admin
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
