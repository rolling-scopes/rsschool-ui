import { IFeedRecord } from 'core/models';
import { classNames } from 'core/styles';
import * as React from 'react';
import { defaultTemplate, feedTemplates } from './feedTemplates';

const cn = classNames(require('./index.scss'));

type Props = {
    feedData: IFeedRecord[];
};

class Feed extends React.Component<Props> {
    hasData() {
        return Array.isArray(this.props.feedData) && this.props.feedData.length > 0;
    }

    render() {
        return (
            <div>
                <h3>Feed</h3>
                {this.hasData() ? (
                    this.props.feedData.map((feedRecord, i) => {
                        const template = feedTemplates[feedRecord.entityType][feedRecord.actionType];

                        return (
                            <div className={cn('feed-record')} key={i}>
                                <div className={cn('feed-container')}>
                                    {template ? template(feedRecord) : defaultTemplate(feedRecord)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>Nothing to show</div>
                )}
            </div>
        );
    }
}

export default Feed;
