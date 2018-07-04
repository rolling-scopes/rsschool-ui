import { shallow } from 'enzyme';
import * as React from 'react';
import Courses from './index';
const { __stateGetter } = require('react-redux');

const noop = () => {};

describe('Courses', () => {
    beforeEach(() => {
        __stateGetter.mockImplementation(() => ({}));
    });

    it('renders correctly', () => {
        const output = shallow(
            <Courses courses={[]} participations={[]} enrollUser={noop} fetchCourses={noop} feed={[]} />,
        );
        expect(output).toMatchSnapshot();
    });
});
