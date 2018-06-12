import { ICourse, IUserParticipation } from 'core/models';
import { classNames } from 'core/styles';
import * as React from 'react';
import { Button, Card, CardBody, CardDeck, CardHeader } from 'reactstrap';

const cn = classNames(require('./index.scss'));

type Props = {
    courses: ICourse[];
    participations: IUserParticipation[];
    enroll: (id: string) => void;
};

class CoursesEnrollment extends React.PureComponent<Props> {
    enroll = (courseId: string) => {
        this.props.enroll(courseId);
    };

    isParticipant = (course: ICourse): boolean => {
        return this.props.participations.find(p => course._id === p.courseId) != null;
    };

    render() {
        // TODO: use 'reselect'
        const courses = this.props.courses.map(course => ({
            ...course,
            participation: this.props.participations.find(p => course._id === p.courseId),
        }));

        return (
            <CardDeck className="card-deck">
                {courses.map(course => (
                    <Card className={cn('bg-secondary', 'course-card')}>
                        <CardHeader>
                            <h5>{course.name}</h5>
                        </CardHeader>
                        <CardBody>
                            <p className="card-text">{course.description}</p>
                            {this.isParticipant(course) ? (
                                <p>
                                    You have enrolled as{' '}
                                    <span className={cn('course-role')}>
                                        {course.participation ? course.participation.role : 'UNKNOWN'}
                                    </span>
                                </p>
                            ) : (
                                <Button onClick={() => this.enroll(course._id)} color="primary">
                                    Enroll
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </CardDeck>
        );
    }
}

export default CoursesEnrollment;
