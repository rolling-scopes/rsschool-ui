import * as React from 'react';

import Header from '../components/Header';
import { TasksForm } from '../components/TasksForm';
import withSession, { Session } from '../components/withSession';

import '../index.scss';

type Props = {
  session?: Session;
};

class Tasks extends React.Component<Props> {
  render() {
    if (!this.props.session) {
      return null;
    }
    return (
      <div>
        <Header username={this.props.session.githubId} />
        <TasksForm />
      </div>
    );
  }
}

export default withSession(Tasks);
