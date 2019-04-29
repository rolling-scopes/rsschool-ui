import * as React from 'react';
import Router from 'next/router';
import withSession, { Session } from '../components/withSession';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Header from '../components/Header';

type Props = {
  session?: Session;
};

class IndexPage extends React.Component<Props> {
  getLinks() {
    return [
      {
        name: '2019-Q1: Submit Score',
        link: '/task-score',
      },
      {
        name: '2019-Q1: Students',
        link: '/students',
      },
      {
        name: '2019-Q1: Score',
        link: '/score',
      },
      {
        name: 'All Tasks',
        link: '/tasks',
      },
    ];
  }

  render() {
    const links = this.getLinks();
    if (!this.props.session) {
      return null;
    }
    return (
      <div>
        <Header username={this.props.session.githubId} />
        <ListGroup>
          {links.map(linkInfo => {
            return (
              <ListGroupItem key={linkInfo.link}>
                <a
                  href={linkInfo.link}
                  onClick={evt => {
                    evt.preventDefault();
                    Router.push(linkInfo.link);
                  }}
                >
                  {linkInfo.name}{' '}
                </a>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

export default withSession(IndexPage);
