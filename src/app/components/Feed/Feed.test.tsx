import { FeedActions, FeedEntities } from 'core/models';
import { shallow } from 'enzyme';
import * as React from 'react';
import Feed from './index';

describe('Feed', () => {
    it('renders correctly ', () => {
        const output = shallow(
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
            />,
        );
        expect(output).toMatchSnapshot();
    });

    it('renders correctly if no data', () => {
        const output = shallow(<Feed feedData={[]} />);
        expect(output).toMatchSnapshot();
    });
});
