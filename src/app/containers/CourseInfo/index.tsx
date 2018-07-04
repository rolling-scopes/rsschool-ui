import { fetchCourseMentors, fetchCourseStudents } from 'core/actions';
import { ICourseMentor, ICourseStudent } from 'core/models';
import { RootState } from 'core/reducers';
import * as React from 'react';
import CourseStudents from 'components/CourseStudents';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState, props: Props): Props => {
    return {
        ...props,
        courseStudents: state.course.students,
    };
};

const mapDispatchToProps = (dispatch: any, props: Props): Props => {
    return {
        ...props,
        fetchCourseMentors: (courseId: string) => {
            dispatch(fetchCourseMentors(courseId));
        },
        fetchCourseStudents: (courseId: string) => {
            dispatch(fetchCourseStudents(courseId));
        },
    };
};

type Props = {
    match?: {
        params: {
            id: string;
        };
    };
    courseId: string;
    courseMentors: ICourseMentor[];
    courseStudents: ICourseStudent[];
    fetchCourseMentors: (courseId: string) => void;
    fetchCourseStudents: (courseId: string) => void;
};

class CourseInfo extends React.Component<Props, any> {
    componentDidMount() {
        if (this.props.match) {
            this.props.fetchCourseStudents(this.props.match.params.id);
        }
    }

    render() {
        return <CourseStudents courseStudents={this.props.courseStudents} />;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CourseInfo);
