import * as React from 'react';
import { Button } from 'reactstrap';
import Select from 'react-select';
import { components } from 'react-select';
import { Header } from 'components';
import Link from 'next/link';
import axios from 'axios';
import ReactTable, { RowInfo } from 'react-table';
import withSession, { Session } from 'components/withSession';
import withCourseData from 'components/withCourseData';
import { CourseService, CourseTask, Course, StudentBasic } from 'services/course';

import '../../../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

type State = {
  isLoading: boolean;
  courseTaskId: number | null;
  courseTasks: CourseTask[];
};

type Task = {
  name: string;
  taskId: number;
};

const formatDisplayValue = (data: CourseTask) => {
  return `${data.name}`;
};

const Option = (props: any) => {
  const data: CourseTask = props.data;

  return (
    <components.Option {...props} key={data.courseTaskId}>
      {formatDisplayValue(data)}
    </components.Option>
  );
};

const SingleValue = (props: any) => {
  const data: CourseTask = props.data;

  return (
    <components.SingleValue {...props} value={data.courseTaskId}>
      {formatDisplayValue(data)}
    </components.SingleValue>
  );
};

class TaskAssignPage extends React.Component<Props> {
  state: State = {
    isLoading: true,
    courseTaskId: null,
    courseTasks: [],
  };

  private courseService: CourseService;

  private loadTasks = async (searchText: any) => {
    if (!searchText) {
      return [];
    }

    return await this.courseService.getCourseTasksWithTaskCheckers(this.props.course.id);
  };

  constructor(props: Props) {
    super(props);
    this.courseService = new CourseService();
    this.onChange = this.onChange.bind(this);
    this.assignTask = this.assignTask.bind(this);
  }

  async componentDidMount() {
    const courseTasks = await this.courseService.getCourseTasksWithTaskCheckers(this.props.course.id);
    this.setState({
      isLoading: false,
      courseTasks,
    });
  }

  onChange(task: CourseTask) {
    this.setState({ courseTaskId: task.courseTaskId });
  }

  async assignTask() {
    const { courseTaskId } = this.state;

    this.setState({
      isLoading: true,
    });

    await axios.post(`/api/course/${this.props.course.id}/task/${courseTaskId}/shuffle`);
    const courseTasks = await this.courseService.getCourseTasks(this.props.course.id);
    this.setState({ courseTasks, isLoading: false });
  }

  // tslint:disable-next-line:max-line-length
  stringFilter = (filter: any, row: any) =>
    (row[filter.id] || '')
      .toLowerCase()
      .trim()
      .startsWith(filter.value.toLowerCase());

  taskFilter = (filter: any, row: any) => {
    const task = this.state.courseTasks.find(c => c.courseTaskId === row.courseTaskId);
    const value = task ? task.name : '';
    return value
      .toLowerCase()
      .trim()
      .startsWith(filter.value.toLowerCase());
  };

  render() {
    if (!this.props.session || !this.props.session.roles || !this.props.course) {
      return null;
    }

    const { isAdmin } = this.props.session;

    return (
      <>
        <Header username={this.props.session ? this.props.session.githubId : 'noname'} />
        <h2>{this.props.course.name}</h2>
        {!isAdmin ? null : (
          <div>
            <Select
              placeholder={'Choose task'}
              getOptionValue={(task: Task) => task.name}
              components={{ Option, SingleValue }}
              cacheOptions={true}
              loadOptions={this.loadTasks}
              options={this.state.courseTasks}
              onChange={(value: any) => this.onChange(value)}
            />
            <Button color="success" onClick={this.assignTask}>
              Assign
            </Button>
          </div>
        )}
        <ReactTable
          defaultSorted={[{ id: 'total', desc: false }]}
          defaultPageSize={100}
          getTrProps={(_: any, rowInfo?: RowInfo) => {
            if (!rowInfo || !rowInfo.original) {
              return {};
            }
            const student = rowInfo.original as StudentBasic;
            return { className: !student.isActive ? 'rt-expelled' : '' };
          }}
          data={this.state.courseTasks.map((c: any) => c.taskCheckers).reduce((acc, v) => acc.concat(v), [])}
          columns={[
            {
              Header: 'Task Name',
              accessor: 'courseTaskId',
              filterable: true,
              Cell: (props: any) => {
                const task = this.state.courseTasks.find(c => c.courseTaskId === props.value);
                return <div>{task ? task.name : 'noname'}</div>;
              },
              filterMethod: this.taskFilter,
            },
            {
              Header: 'Mentor Github Id',
              accessor: 'mentor.user.githubId',
              filterable: true,
              Cell: (props: any) => (
                <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                  <a>{props.value}</a>
                </Link>
              ),
            },
            {
              Header: 'Student Github Id',
              accessor: 'student.user.githubId',
              filterable: true,
              Cell: (props: any) => (
                <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                  <a>{props.value}</a>
                </Link>
              ),
            },
          ]}
        />
      </>
    );
  }
}

export default withCourseData(withSession(TaskAssignPage));
