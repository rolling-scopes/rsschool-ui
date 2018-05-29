import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReduxProviderDecorator } from '../../storybook/ReduxProviderDecorator';
import Courses from './index';

const noop = () => {};

storiesOf('Courses', module)
    .addDecorator(storyFn => <ReduxProviderDecorator>{storyFn()}</ReduxProviderDecorator>)
    .add('No Data', () => {
        return (
            <Courses
                courses={[]}
                feed={[]}
                participations={[]}
                fetchUserParticipations={noop}
                enrollUser={noop}
                fetchCourses={noop}
            />
        );
    });
