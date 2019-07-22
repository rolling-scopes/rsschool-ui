import * as React from 'react';
import ReactTable from 'react-table';
import Link from 'next/link';

import Header from '../components/Header';
import axios from 'axios';
import { LoadingScreen } from '../components/LoadingScreen';
import withCourseData, { Course } from '../components/withCourseData';
import withSession from '../components/withSession';

import '../index.scss';

type Props = {
  githubId: string;
  course: Course;
};

type State = {
  students: any[];
  isLoading: boolean;
};
class StudentsPage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    students: [],
  };

  async componentDidMount() {
    const response = await axios(`/api/course/${this.props.course.id}/students`);
    this.setState({
      students: response.data.data,
      isLoading: false,
    });
  }

  render() {
    return (
      <LoadingScreen show={this.state.isLoading}>
        <Header username={''} />
        <h2>{this.props.course.name}</h2>
        <ReactTable
          filterable={true}
          defaultPageSize={100}
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          data={this.state.students}
          columns={[
            {
              Header: 'Student Id',
              accessor: 'studentId',
            },
            {
              Header: 'First Name',
              accessor: 'firstName',
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            {
              Header: 'Github Id',
              accessor: 'githubId',
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
            {
              Header: 'Profile',
              accessor: 'githubId',
              Cell: props => (
                <Link href={{ pathname: '/profile', query: { githubId: props.value } }}>
                  <a>Show profile</a>
                </Link>
              ),
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
          ]}
        />
      </LoadingScreen>
    );
  }
}

export default withCourseData(withSession(StudentsPage));
