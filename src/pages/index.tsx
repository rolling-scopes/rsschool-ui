import * as React from 'react';
import Router from 'next/router';
import withSession, { Session } from '../components/withSession';
import withCourses from '../components/withCourses';
import { Course } from '../components/withCourseData';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Header from '../components/Header';

import '../index.scss';

type Props = {
  courses?: Course[];
  session?: Session;
};

type LinkInfo = {
  name: string;
  link: string;
};

class IndexPage extends React.Component<Props> {
  getLinks = (course: Course) => {
    if (!this.props.session) {
      return [];
    }
    const role = this.props.session.roles[course.id];
    if (!role && !this.props.session.isAdmin) {
      return [];
    }

    const result = [
      {
        name: `Score`,
        link: `/score?course=${course.alias}`,
      },
      {
        name: `Leave Feedback`,
        link: `/feedback?course=${course.alias}`,
      },
    ];
    const isMentorOrAdmin = role === 'mentor' || this.props.session.isAdmin;
    if (!isMentorOrAdmin) {
      return result;
    }
    return result.concat([
      {
        name: `Submit Score`,
        link: `/task-score?course=${course.alias}`,
      },
      {
        name: `Students`,
        link: `/students?course=${course.alias}`,
      },
      {
        name: `Expel Student`,
        link: `/expel?course=${course.alias}`,
      },
      {
        name: `Course Tasks`,
        link: `/course-tasks?course=${course.alias}`,
      },
    ]);
  };

  renderLinks() {
    return (this.props.courses || [])
      .sort((a, b) => b.alias.localeCompare(a.alias))
      .map(course => {
        return (
          <div className="m-2 mt-4" key={course.id}>
            <h3>{course.name}</h3>
            <ListGroup>{this.getLinks(course).map(this.renderLink)}</ListGroup>
          </div>
        );
      });
  }

  renderLink = (linkInfo: LinkInfo) => {
    return (
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
    );
  };

  render() {
    const links = this.renderLinks();
    if (!this.props.session) {
      return null;
    }
    return (
      <div>
        <Header username={this.props.session.githubId} />
        <div className="m-2 mb-4">{this.renderLink({ name: 'All Tasks', link: '/tasks' })}</div>
        {links}
      </div>
    );
  }
}

export default withCourses(withSession(IndexPage));
