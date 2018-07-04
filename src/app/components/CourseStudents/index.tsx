import { ICourseStudent } from 'core/models';
import * as React from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

type Props = {
    courseStudents: ICourseStudent[];
};

class CourseStudents extends React.PureComponent<Props> {
    render() {
        return (
            <div>
                <h3 className="mb-3"> Students</h3>

                <ReactTable
                    data={this.props.courseStudents}
                    defaultPageSize={100}
                    filterable={true}
                    columns={[
                        {
                            Header: 'Github Username',
                            accessor: 'user._id',
                        },
                        {
                            Header: 'First Name',
                            accessor: 'user.profile.firstName',
                        },
                        {
                            Header: 'Last Name',
                            accessor: 'user.profile.lastName',
                        },
                        {
                            Header: 'City',
                            accessor: 'user.profile.city',
                        },
                        {
                            Header: 'Mentors',
                            id: 'mentors._id',
                            accessor: (student: ICourseStudent) => student.mentors.map((i: any) => i._id).join(','),
                        },
                    ]}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

export default CourseStudents;
