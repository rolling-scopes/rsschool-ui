import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Login from './index';

storiesOf('Login', module).add('Default', () => {
    return <Login />;
});
