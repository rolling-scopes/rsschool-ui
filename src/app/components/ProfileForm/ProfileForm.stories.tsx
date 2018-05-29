import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReduxProviderDecorator } from '../../storybook/ReduxProviderDecorator';
import ProfileForm from './index';

storiesOf('Profile Form', module)
    .addDecorator(storyFn => <ReduxProviderDecorator>{storyFn()}</ReduxProviderDecorator>)
    .add('Default', () => {
        return <ProfileForm />;
    });
