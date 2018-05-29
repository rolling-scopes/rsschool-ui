import { fetchUserParticipations } from 'core/actions';
import { IUserParticipation } from 'core/models';
import { RootState } from 'core/reducers';
import { classNames } from 'core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const cn = classNames(require('./index.scss'));

const mapStateToProps = (state: RootState, props: any): Props => {
    return {
        ...props,
        route: state.router.location,
        participations: state.user.participations,
        hasCourse: Array.isArray(state.user.participations) && state.user.participations.length > 0,
    };
};

const mapDispatchToProps = (dispatch: any, props: any): Props => {
    return {
        ...props,
        fetchUserCourses: () => {
            dispatch(fetchUserParticipations());
        },
    };
};

type Props = {
    hasCourse: boolean;
    participations: IUserParticipation[];
    fetchUserCourses: () => void;
};

class Header extends React.Component<Props, any> {
    componentDidMount() {
        this.props.fetchUserCourses();
    }

    render() {
        const couserId = this.props.hasCourse ? this.props.participations[0].courseId : undefined;

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
                        {
                            <li className="nav-item">
                                <NavLink exact={true} className="nav-link" to={`/courses`}>
                                    Courses
                                </NavLink>
                            </li>
                        }
                        {this.props.hasCourse && (
                            <li className="nav-item">
                                <NavLink exact={true} className="nav-link" to={`/course/${couserId}/events`}>
                                    Schedule
                                </NavLink>
                            </li>
                        )}
                        {this.props.hasCourse && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to={`/course/${couserId}/tasks`}>
                                    Tasks
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/profile">
                                Profile
                            </NavLink>
                        </li>
                        {this.props.hasCourse && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/me/mentor">
                                    My Mentor
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header);
