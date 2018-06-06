import * as React from 'react';
import { Button, CardBody, Card, CardHeader } from 'reactstrap';
import { RootState } from 'core/reducers';
import { assignMentors, fetchCourses } from 'core/actions';
import { ICourse } from 'core/models';
import { connect } from 'react-redux';

import './index.scss';

const mapStateToProps = (state: RootState, props: any): Props => {
    return {
        ...props,
        courses: state.courses.data,
    };
};

const mapDispatchToProps = (dispatch: any, props: Props): Props => {
    return {
        ...props,
        fetchCourses: () => {
            dispatch(fetchCourses());
        },
        assignMentors: (courseId: string) => {
            dispatch(assignMentors(courseId));
        },
    };
};

type Props = {
    courses: ICourse[];
    fetchCourses: () => void;
    assignMentors: (courseId: string) => void;
};

class Admin extends React.Component<Props> {
    componentDidMount() {
        this.props.fetchCourses();
    }

    render() {
        return (
            <div className="row">
                {this.props.courses.map(course => (
                    <div className="col-sm-6">
                        <Card color="secondary">
                            <CardHeader>
                                <h4>{course.name}</h4>
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.props.assignMentors(course._id)}>
                                    Assign Mentors
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Admin);
