import { FeedActions, FeedEntities, IFeedRecord } from 'core/models';
import { DateTime } from 'luxon';
import * as React from 'react';

const getDateText = (d: number) => {
    return DateTime.fromMillis(d).toISODate();
};

export const feedTemplates: any = {
    [FeedEntities.User]: {
        [FeedActions.SIGNUP]: (feedRecord: IFeedRecord): any => {
            return (
                <div>
                    <div>{getDateText(feedRecord.dateTime)}</div>
                    <p>You signed up to Rolling Scopes School</p>
                </div>
            );
        },
    },
    [FeedEntities.Course]: {
        [FeedActions.ENROLL]: (feedRecord: IFeedRecord): any => {
            return (
                <div>
                    <div>{getDateText(feedRecord.dateTime)}</div>
                    <p>You enrolled to {feedRecord.courseId}</p>
                </div>
            );
        },
    },
};

export const defaultTemplate = (feedRecord: IFeedRecord): any => {
    return (
        <div>
            <div>{getDateText(feedRecord.dateTime)}</div>
            <p>There is some action</p>
        </div>
    );
};
