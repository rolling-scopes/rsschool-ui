import { shallow } from 'enzyme';
import * as React from 'react';
import Courses from './index';
const { __stateGetter } = require('react-redux');

const noop = () => {};

describe('Course', () => {
    beforeEach(() => {
        __stateGetter.mockImplementation(() => ({
            course: {
                students: [],
            },
        }));
    });

    it('renders correctly', () => {
        const output = shallow(
            <Courses
                courseId={'1'}
                courseMentors={[]}
                courseStudents={[]}
                fetchCourseMentors={noop}
                fetchCourseStudents={noop}
            />,
        );
        expect(output).toMatchSnapshot();
    });
});
