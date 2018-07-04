import CoursesEnrollment from 'components/CoursesEnrollment';
import { enrollUserInCourse, fetchAllCourses, fetchUserParticipations } from 'core/actions';
import { ICourse, IFeedRecord, IUserParticipation } from 'core/models';
import { RootState } from 'core/reducers';
// import { classNames } from 'core/styles';
import * as React from 'react';
import { connect } from 'react-redux';

// const styles = require('./index.scss');
// const cn = classNames(styles);

const mapStateToProps = (state: RootState, props: Props): Props => {
    if (state.courses == null || state.user == null) {
        return props;
    }
    return {
        ...props,
        courses: state.courses.data || [],
        participations: state.user.participations || [],
        feed: state.user.feed || [],
    };
};

const mapDispatchToProps = (dispatch: any, props: Props): Props => {
    return {
        ...props,
        fetchCourses: () => {
            dispatch(fetchAllCourses());
            dispatch(fetchUserParticipations());
        },
        enrollUser: (id: string) => {
            dispatch(enrollUserInCourse(id));
        },
    };
};

type Props = {
    courses: ICourse[];
    enrollUser: (courseId: string) => void;
    feed: IFeedRecord[];
    fetchCourses: () => void;
    participations: IUserParticipation[];
};

class Courses extends React.Component<Props, any> {
    componentDidMount() {
        this.props.fetchCourses();
    }

    render() {
        return (
            <div>
                <CoursesEnrollment
                    courses={this.props.courses || []}
                    participations={this.props.participations || []}
                    enroll={(courseId: string) => this.props.enrollUser(courseId)}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Courses);
