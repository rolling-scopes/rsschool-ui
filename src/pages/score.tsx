import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import { LoadingScreen } from '../components/LoadingScreen';
import ReactTable, { RowInfo } from 'react-table';
import Link from 'next/link';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { sortTasksByEndDate } from '../services/rules';

import '../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

type State = {
  students: any[];
  isLoading: boolean;
  courseTasks: any[];
  scoreWeights: { [key: string]: number };
};

interface CourseTask {
  courseTaskId: number;
  studentEndDate: string | null;
  scoreWeight: number | null;
}

class ScorePage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    courseTasks: [],
    scoreWeights: {},
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [scoreResponse, tasksResponse] = await Promise.all([
      fetch(`/api/course/${this.props.course.id}/score`, {
        credentials: 'same-origin',
      }),
      fetch(`/api/course/${this.props.course.id}/tasks`, {
        credentials: 'same-origin',
      }),
    ]);

    if (!scoreResponse.ok || !tasksResponse.ok) {
      this.setState({ isLoading: false });
      return;
    }

    const [score, tasks] = await Promise.all<any, { data: CourseTask[] }>([scoreResponse.json(), tasksResponse.json()]);
    const sortedTasks = tasks.data.filter(task => task.studentEndDate).sort(sortTasksByEndDate);
    const scoreWeights = sortedTasks.reduce(
      (acc, courseTask) => {
        acc[courseTask.courseTaskId] = courseTask.scoreWeight || 1;
        return acc;
      },
      {} as { [key: string]: number },
    );
    this.setState({
      scoreWeights,
      students: score.data,
      courseTasks: sortedTasks,
      isLoading: false,
    });
  }

  getColumns() {
    const columns = this.state.courseTasks.map(task => ({
      id: task.courseTaskId,
      Header: () => {
        return task.descriptionUrl ? (
          <a className="table-header-link" href={task.descriptionUrl}>
            {task.name}
          </a>
        ) : (
          <div>{task.name}</div>
        );
      },
      sortMethod: this.numberSort,
      accessor: (d: any) => {
        const currentTask = d.taskResults.find((taskResult: any) => taskResult.courseTaskId === task.courseTaskId);
        return currentTask ? <div>{currentTask.score}</div> : 0;
      },
    }));
    return columns;
  }

  stringFilter = (filter: any, row: any) => (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase());

  numberSort = (a: number, b: number) => b - a;

  render() {
    if (!this.props.session) {
      return null;
    }
    return (
      <LoadingScreen show={this.state.isLoading}>
        <Header username={this.props.session.githubId} />
        <h2>{this.props.course.name}</h2>
        <ReactTable
          filterable={true}
          defaultSorted={[
            {
              id: 'total',
              desc: false,
            },
          ]}
          getTrProps={(_: any, rowInfo?: RowInfo) => {
            if (!rowInfo || rowInfo.original) {
              return {};
            }
            return {
              className: rowInfo.original.isExpelled ? 'rt-expelled' : '',
            };
          }}
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
              filterMethod: this.stringFilter,
            },
            {
              Header: 'First Name',
              accessor: 'firstName',
              maxWidth: 160,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              maxWidth: 160,
              filterMethod: this.stringFilter,
            },
            ...this.getColumns(),
            {
              id: 'total',
              Header: 'Total',
              accessor: (d: any) => {
                return d.taskResults.reduce(
                  (acc: number, value: any) => acc + value.score * (this.state.scoreWeights[value.courseTaskId] || 1),
                  0,
                );
              },
              sortMethod: this.numberSort,
            },
          ]}
        />
      </LoadingScreen>
    );
  }
}

export default withCourseData(withSession(ScorePage));
