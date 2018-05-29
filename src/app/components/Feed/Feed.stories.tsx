import { storiesOf } from '@storybook/react';
import { FeedActions, FeedEntities } from 'core/models';
import * as React from 'react';
import Feed from './index';

storiesOf('Feed', module)
    .add('Default', () => {
        return (
            <Feed
                feedData={[
                    {
                        dateTime: 1530000000000,
                        actionType: FeedActions.ENROLL,
                        entityType: FeedEntities.User,
                        data: {},
                        userId: 'apalchys',
                    },
                ]}
            />
        );
    })
    .add('No Data', () => {
        return <Feed feedData={[]} />;
    });
