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

class CoursesEnrollment extends React.Component<Props> {
    enroll = (courseId: string) => {
        this.props.enroll(courseId);
    };

    isParticipant = (course: ICourse): boolean => {
        return this.props.participations.find(p => course._id === p.courseId) != null;
    };

    render() {
        return (
            <CardDeck className="card-deck">
                <Card className={cn('bg-secondary', 'course-card')}>
                    <CardHeader>Available Courses</CardHeader>
                    <CardBody>
                        {this.props.courses.map(course => (
                            <div key={course._id}>
                                <h3>{course.name}</h3>
                                <p className="card-text">This course for BSU stdents only</p>
                                {this.isParticipant(course) ? (
                                    <p>You have enrolled already</p>
                                ) : (
                                    <Button onClick={() => this.enroll(course._id)} color="primary">
                                        Enroll
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </CardDeck>
        );
    }
}

export default CoursesEnrollment;
