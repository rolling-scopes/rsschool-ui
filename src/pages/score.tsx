import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import LoadingScreen from '../components/LoadingScreen';
import ReactTable from 'react-table';
import Link from 'next/link';
import withSession, { Session } from '../components/withSession';

import 'react-table/react-table.css';
import '../index.scss';

type Props = {
  session?: Session;
};

type State = {
  students: any[];
  isLoading: boolean;
  tasks: any[];
};

class ScoresPage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    students: [],
    tasks: [],
  };

  async componentDidMount() {
    const [scoreResponse, tasksResponse] = await Promise.all([
      fetch(`/api/course/1/score`),
      fetch(`/api/course/1/tasks`),
    ]);

    const [score, tasks] = await Promise.all([scoreResponse.json(), tasksResponse.json()]);

    this.setState({
      students: score.data,
      tasks: tasks.data,
      isLoading: false,
    });
  }

  getColumns() {
    const columns = this.state.tasks.map(task => ({
      id: task.courseTaskId,
      Header: task.name,
      sortMethod: undefined,
      accessor: (d: any) => {
        if (!task) {
          return 0;
        }
        const currentTask = d.taskResults.find((taskResult: any) => taskResult.courseTaskId === task.courseTaskId);
        return currentTask ? <div>{currentTask.score}</div> : 0;
      },
    }));
    return columns;
  }

  render() {
    if (!this.props.session) {
      return null;
    }
    if (this.state.isLoading) {
      return <LoadingScreen show={true} />;
    }
    return (
      <>
        <Header username={this.props.session.githubId} />
        <h2>2019 Q1 Score</h2>
        <ReactTable
          filterable={true}
          defaultPageSize={100}
          defaultSorted={[
            {
              id: 'total',
              desc: false,
            },
          ]}
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          data={this.state.students}
          columns={[
            {
              Header: 'Github Id',
              accessor: 'githubId',
              maxWidth: 160,
              Cell: (props: any) => (
                <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                  <a>{props.value}</a>
                </Link>
              ),
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            {
              Header: 'First Name',
              accessor: 'firstName',
              maxWidth: 160,
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              maxWidth: 160,
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            ...this.getColumns(),
            {
              id: 'total',
              Header: 'Total',
              accessor: (d: any) => {
                return d.taskResults.reduce((acc: number, value: any) => acc + value.score, 0);
              },
              sortMethod: (a: number, b: number) => b - a,
            },
          ]}
        />
      </>
    );
  }
}

export default withSession(ScoresPage);
