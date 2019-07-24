import axios from 'axios';
import Link from 'next/link';
import * as React from 'react';
import lodashRound from 'lodash.round';
import ReactTable, { RowInfo } from 'react-table';
import Header from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import withCourseData, { Course } from '../components/withCourseData';
import withSession, { Session } from '../components/withSession';
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
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [scoreResponse, tasksResponse] = await Promise.all([
      axios.get(`/api/course/${this.props.course.id}/score`),
      axios.get<{ data: CourseTask[] }>(`/api/course/${this.props.course.id}/tasks`),
    ]);

    const score = scoreResponse.data;
    const tasks = tasksResponse.data;

    const sortedTasks = tasks.data
      .filter(task => task.studentEndDate || this.props.course.completed)
      .sort(sortTasksByEndDate);
    const scoreWeights = sortedTasks.reduce(
      (acc, courseTask) => {
        acc[courseTask.courseTaskId] = courseTask.scoreWeight || 1;
        return acc;
      },
      {} as { [key: string]: number },
    );
    this.setState({
      students: score.data
        .map((d: any) => {
          d.total = this.calculateTotal(d, scoreWeights);
          return d;
        })
        .sort((a: any, b: any) => this.numberSort(a.total, b.total))
        .map((d: any, i: number) => {
          d.index = i + 1;
          return d;
        }),
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
      className: 'align-right',
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
          defaultSorted={[{ id: 'total', desc: false }]}
          defaultPageSize={100}
          className="-striped"
          getTrProps={(_: any, rowInfo?: RowInfo) => {
            if (!rowInfo || !rowInfo.original) {
              return {};
            }
            return { className: rowInfo.original.isExpelled ? 'rt-expelled' : '' };
          }}
          data={this.state.students}
          columns={[
            {
              Header: '#',
              accessor: 'index',
              maxWidth: 50,
              filterable: false,
              Cell: (row: any) => row.page * row.pageSize + row.viewIndex + 1,
            },
            {
              Header: 'Github Id',
              accessor: 'githubId',
              minWidth: 160,
              maxWidth: 200,
              filterable: true,
              Cell: (props: any) => (
                <>
                  <img src={`https://github.com/${props.value}.png`} className="cell-avatar" height={24} width={24} />
                  <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                    <a>{props.value}</a>
                  </Link>
                </>
              ),
              filterMethod: this.stringFilter,
            },
            {
              Header: 'First Name',
              accessor: 'firstName',
              maxWidth: 160,
              filterable: true,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              maxWidth: 160,
              filterable: true,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Mentor Github Id',
              accessor: 'mentorGithubId',
              maxWidth: 160,
              filterable: true,
              Cell: (props: any) => (
                <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                  <a>{props.value}</a>
                </Link>
              ),
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Total',
              accessor: 'total',
              maxWidth: 80,
              filterable: false,
              className: 'align-right',
              sortMethod: this.numberSort,
              Cell: (props: any) => <span className="td-selected">{props.value}</span>,
            },
            ...this.getColumns(),
          ]}
        />
      </LoadingScreen>
    );
  }

  private calculateTotal = (
    d: { taskResults: { score: number; courseTaskId: number }[] },
    scoreWeights: { [key: string]: number },
  ) => {
    const total = d.taskResults.reduce((acc: number, value) => {
      const weight = scoreWeights[value.courseTaskId];
      return acc + value.score * (weight != null ? weight : 1);
    }, 0);
    return lodashRound(total, 1);
  };
}

export default withCourseData(withSession(ScorePage));
