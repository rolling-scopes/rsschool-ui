import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReduxProviderDecorator } from '../../storybook/ReduxProviderDecorator';
import Home from './index';

const noop = () => {};

storiesOf('Home', module)
    .addDecorator(storyFn => <ReduxProviderDecorator>{storyFn()}</ReduxProviderDecorator>)
    .add('No Data', () => {
        return <Home feed={[]} fetchFeed={noop} />;
    });
