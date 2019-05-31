import * as React from 'react';
import Header from '../components/Header';
import withSession, { Session } from '../components/withSession';

import '../index.scss';

type Props = {
    session?: Session;
};

class FeedbackPage extends React.Component<Props> {
      render() {
        if (!this.props.session) {
          return null;
        }

        return (
          <>
            <Header username={this.props.session.githubId} />
            <div className="m-3">
              <h3 className="mb-3">#gratitude</h3>
            </div>
          </>
        );
    }
};

export default withSession(FeedbackPage);
