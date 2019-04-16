import * as React from 'react';
import TaskScoreForm from '../components/TaskScoreForm';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import Login from '../components/Login';
import LoadingScreen from '../components/LoadingScreen';

import '../index.scss';

type Props = {
  githubId: string;
};

type State = {
  githubId?: string;
  isLoading: boolean;
};

class TaskScorePage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
  };

  async componentDidMount() {
    const response = await fetch(`/api/session`);

    if (!response.ok) {
      this.setState({ isLoading: false });
      return;
    }

    const json = await response.json();
    this.setState({
      githubId: json.data.githubId,
      isLoading: false,
    });
  }

  renderLoading() {
    if (this.state.isLoading) {
      return <LoadingScreen show={true} />;
    }
    return null;
  }

  renderLogin() {
    if (!this.state.githubId && !this.state.isLoading) {
      return <Login />;
    }
    return null;
  }

  renderForm() {
    if (this.state.githubId) {
      return (
        <div>
          <Header username={this.state.githubId} />
          <TaskScoreForm courseId={1} />
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <>
        {this.renderLoading()}
        {this.renderLogin()}
        {this.renderForm()}
      </>
    );
  }
}

export default TaskScorePage;
