import Link from 'next/link';
import * as React from 'react';
import ReactTable, { RowInfo } from 'react-table';
import { Alert } from 'reactstrap';
import { Header } from 'components/Header';
import { LoadingScreen } from 'components/LoadingScreen';
import withCourseData from 'components/withCourseData';
import { Course, CourseTask, CourseService, StudentScore } from 'services/course';
import withSession, { Session } from 'components/withSession';
import { sortTasksByEndDate } from 'services/rules';

import '../../index.scss';

type Props = {
  session: Session;
  course: Course;
};

type State = {
  students: StudentScore[];
  isLoading: boolean;
  courseTasks: CourseTask[];
};

class ScorePage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    courseTasks: [],
  };

  courseService = new CourseService();

  async componentDidMount() {
    this.setState({ isLoading: true });

    const [courseScore, courseTasks] = await Promise.all([
      this.courseService.getCourseScore(this.props.course.id),
      this.courseService.getCourseTasks(this.props.course.id),
    ]);

    const sortedTasks = courseTasks
      .filter(task => !!task.studentEndDate || this.props.course.completed)
      .sort(sortTasksByEndDate);

    this.setState({ students: courseScore, courseTasks: sortedTasks, isLoading: false });
  }

  getColumns() {
    const columns = this.state.courseTasks.map(task => ({
      id: task.courseTaskId.toString(),
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
      accessor: (d: StudentScore) => {
        const currentTask = d.taskResults.find((taskResult: any) => taskResult.courseTaskId === task.courseTaskId);
        return currentTask ? <div>{currentTask.score}</div> : 0;
      },
    }));
    return columns;
  }

  stringFilter = (filter: any, row: any) => (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase());

  numberSort = (a: number, b: number) => b - a;

  render() {
    return (
      <LoadingScreen show={this.state.isLoading}>
        <Header title="Score" username={this.props.session.githubId} courseName={this.props.course.name} />
        <Alert color="warning">Score is refreshed every 5 minutes</Alert>
        <ReactTable
          defaultSorted={[{ id: 'totalScore', desc: false }]}
          defaultPageSize={100}
          className="-striped"
          getTrProps={(_: any, rowInfo?: RowInfo) => {
            if (!rowInfo || !rowInfo.original) {
              return {};
            }
            return { className: !(rowInfo.original as StudentScore).isActive ? 'rt-expelled' : '' };
          }}
          data={this.state.students}
          columns={[
            {
              Header: '#',
              accessor: 'rank',
              maxWidth: 50,
              filterable: false,
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
              Header: 'Location',
              accessor: 'locationName',
              maxWidth: 120,
              filterable: true,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Mentor Github Id',
              accessor: 'mentor.githubId',
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
              accessor: 'totalScore',
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
}

export default withCourseData(withSession(ScorePage));
