import * as React from 'react';
import Router from 'next/router';
import withSession, { Session } from '../components/withSession';
import withCourses from '../components/withCourses';
import { Course } from '../components/withCourseData';
import { ListGroup, ListGroupItem } from 'reactstrap';
import * as fetch from 'isomorphic-fetch';
import Header from '../components/Header';

import '../index.scss';

type Props = {
  courses: Course[];
  session?: Session;
};

type State = {
  courses: Course[];
};

type LinkInfo = {
  name: string;
  link: string;
};

class IndexPage extends React.Component<Props, State> {
  static async getInitialProps() {
    const coursesResponse = await fetch(`${process.env.RS_HOST}/api/courses`);
    if (coursesResponse.ok) {
      const courses = (await coursesResponse.json()).data;
      return { courses };
    }
    return { courses: [] };
  }

  state: State = {
    courses: [],
  };

  getLinks() {
    const courseLinks = (this.props.courses || []).reduce(
      (acc, course) => {
        return acc.concat([
          {
            name: `${course.name}: Students`,
            link: `/students?course=${course.alias}`,
          },
          {
            name: `${course.name}: Score`,
            link: `/score?course=${course.alias}`,
          },
          {
            name: `${course.name}: Submit Score`,
            link: `/task-score?course=${course.alias}`,
          },
        ]);
      },
      [] as LinkInfo[],
    );

    return courseLinks.concat([
      {
        name: 'All Tasks',
        link: '/tasks',
      },
    ]);
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
          {links.map((linkInfo: LinkInfo) => (
            <ListGroupItem key={linkInfo.link}>
              <a
                href={linkInfo.link}
                onClick={evt => {
                  evt.preventDefault();
                  Router.push(linkInfo.link);
                }}
              >
                {linkInfo.name}
              </a>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default withCourses(withSession(IndexPage));
