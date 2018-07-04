import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReduxProviderDecorator } from '../../storybook/ReduxProviderDecorator';
import Courses from './index';

const noop = () => {};

storiesOf('Course', module)
    .addDecorator(storyFn => <ReduxProviderDecorator>{storyFn()}</ReduxProviderDecorator>)
    .add('No Data', () => {
        return (
            <Courses
                courseId={'1'}
                courseMentors={[]}
                courseStudents={[]}
                fetchCourseMentors={noop}
                fetchCourseStudents={noop}
            />
        );
    });
