import * as React from 'react';
import TaskScoreForm from '../components/TaskScoreForm';
import Header from '../components/Header';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';

import '../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

class TaskScorePage extends React.Component<Props> {
  componentDidMount() {}

  render() {
    if (!this.props.session || !this.props.session.roles || !this.props.course) {
      return null;
    }
    const { roles } = this.props.session;
    if (roles[this.props.course.id] !== 'mentor') {
      return `You are not mentor in ${this.props.course.alias}`;
    }

    return (
      <>
        <div>
          <Header username={this.props.session.githubId} />
          <TaskScoreForm course={this.props.course} />
        </div>
      </>
    );
  }
}

export default withCourseData(withSession(TaskScorePage));
