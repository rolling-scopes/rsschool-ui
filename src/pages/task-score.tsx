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
  render() {
    if (!this.props.session) {
      return null;
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
