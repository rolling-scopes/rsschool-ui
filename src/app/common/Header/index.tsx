import * as React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (): JSX.Element => {
    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <ul className="nav nav-pills justify-content-end">
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
                </ul>
            </div>
        </nav>
    );
};

export default Header;
