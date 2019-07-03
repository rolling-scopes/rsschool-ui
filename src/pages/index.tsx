import Router from 'next/router';
import * as React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Header from '../components/Header';
import { Course } from '../components/withCourseData';
import withCourses from '../components/withCourses';
import withSession, { Session } from '../components/withSession';

import '../index.scss';

type Props = {
  courses?: Course[];
  session?: Session;
};

class IndexPage extends React.PureComponent<Props> {
  private hasAccessToCourse = (session: Session, course: Course) => {
    const { isAdmin, isHirer, isActivist } = session;
    const role = session.roles[course.id];
    return !!role || isAdmin || isHirer || isActivist;
  };

  private getLinks = (course: Course) => {
    if (!this.props.session) {
      return [];
    }

    if (!this.hasAccessToCourse(this.props.session, course)) {
      return [];
    }

    const role = this.props.session.roles[course.id];
    const { isAdmin, isActivist } = this.props.session;
    const isMentor = !!role;

    const result = [
      {
        name: `Score`,
        link: `/score?course=${course.alias}`,
      },
    ];

    if (isAdmin) {
      result.push({
        name: `Course Tasks`,
        link: `/course-tasks?course=${course.alias}`,
      });
    }

    if (course.completed) {
      return result;
    }

    result.push(
      {
        name: `#gratitude`,
        link: `/gratitude?course=${course.alias}`,
      },
      {
        name: `Mentor Contacts`,
        link: `/mentor-contacts?course=${course.alias}`,
      },
      {
        name: `Submit Video & Presentation`,
        link: `/task-artefact?course=${course.alias}`,
      },
      {
        name: `Assign Tasks`,
        link: `/task-assign?course=${course.alias}`,
      },
    );

    if (isActivist || isAdmin) {
      result.push({
        name: `Submit Jury Score`,
        link: `/task-jury-score?course=${course.alias}`,
      });
    }

    if (isMentor || isAdmin) {
      result.push(
        {
          name: `My Students: Submit Score`,
          link: `/task-score?course=${course.alias}`,
        },
        {
          name: `My Students: Expel Student`,
          link: `/expel?course=${course.alias}`,
        },
        {
          name: `Others Students: Interview Feedback`,
          link: `/interview-feedback?course=${course.alias}`,
        },
        {
          name: `Others Students: Submit Score`,
          link: `/task-score-others?course=${course.alias}`,
        },
      );
    }

    return result;
  };

  private renderLinks() {
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

  private renderLink = (linkInfo: LinkInfo) => {
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
        <div className="m-2 mb-4">{this.renderLink({ name: 'My Profile', link: '/profile' })}</div>
        {links}
        <div className="m-2 mb-4">{this.renderLink({ name: 'All Tasks', link: '/tasks' })}</div>
      </div>
    );
  }
}

type LinkInfo = { name: string; link: string };

export default withCourses(withSession(IndexPage));
