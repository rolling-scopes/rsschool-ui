import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import LoadingScreen from '../components/LoadingScreen';
import ReactTable from 'react-table';
import Router from 'next/router';
import Link from 'next/link';

import 'react-table/react-table.css';
import '../index.scss';

type Props = {
  githubId: string;
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
    const response = await fetch(`/api/course/1/students`);

    if (!response.ok) {
      Router.push('/login');
      return;
    }

    const json = await response.json();
    this.setState({
      students: json.data,
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen show={true} />;
    }
    return (
      <>
        <Header username={''} />
        <h2>2019 Q1 Course</h2>
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
              // tslint:disable-next-line:max-line-length
              Cell: props => <Link href={{ pathname: '/profile', query: { githubId: props.value }}}><a>Show profile</a></Link> ,
              filterMethod: (filter: any, row: any) =>
                (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase()),
            },
          ]}
        />
      </>
    );
  }
}

export default StudentsPage;
