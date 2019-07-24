import { ActivityBanner, Header } from 'components';
import { Dropdown, DropdownToggle, Alert, Nav, NavItem, ListGroupItem, DropdownMenu, DropdownItem } from 'reactstrap';
import Router from 'next/router';
import * as React from 'react';
import { Course } from 'services/course';
import withCourses from 'components/withCourses';
import withSession, { Session, Role } from 'components/withSession';
import '../index.scss';

type Props = {
  courses?: Course[];
  session: Session;
};

type State = {
  dropdownOpen: boolean;
  activeCourseId: number | null;
};

const githubIssuesUrl = 'https://github.com/rolling-scopes/rsschool-api/issues';

const anyAccess = () => true;
const isMentor = (_: Course, role: Role, isAdmin: boolean) => role === 'mentor' || isAdmin;
const isAdmin = (_1: Course, _2: Role, isAdmin: boolean) => isAdmin;
const isCourseNotCompleted = (course: Course) => course.status === 'active';

const combine = (...checks: any[]) => (course: Course, role: Role, isAdmin: boolean) =>
  checks.every(check => check(course, role, isAdmin));

const routes = [
  {
    name: `🔥 Score`,
    getLink: (course: Course) => `/course/score?course=${course.alias}`,
    access: anyAccess,
  },
  {
    name: `✅ Check Task`,
    getLink: (course: Course) => `/course/mentor/check-task?course=${course.alias}`,
    access: combine(isCourseNotCompleted, isMentor),
  },
  {
    name: `👏 Public Feedback (#gratitude)`,
    getLink: (course: Course) => `/course/gratitude?course=${course.alias}`,
    access: combine(isCourseNotCompleted, anyAccess),
  },
  {
    name: `💌 Private Feedback`,
    getLink: (_: Course) => `/private-feedback`,
    access: combine(isCourseNotCompleted, anyAccess),
  },
  // {
  //   name: `🎤 Interview Feedback`,
  //   getLink: (course: Course) => `/course/mentor/interview-feedback?course=${course.alias}`,
  //   access: combine(isCourseNotCompleted, isMentor),
  // },
  {
    name: `😢 Expel Student`,
    getLink: (course: Course) => `/course/mentor/expel?course=${course.alias}`,
    access: combine(isCourseNotCompleted, isMentor),
  },
  {
    name: `🗂 Course Tasks`,
    getLink: (course: Course) => `/course/admin/tasks?course=${course.alias}`,
    access: isAdmin,
  },
  {
    name: `🐞 Submit "Bug"`,
    getLink: (_: Course) => `${githubIssuesUrl}/new?assignees=apalchys&labels=&template=bug_report.md`,
    access: combine(isCourseNotCompleted, anyAccess),
  },
  {
    name: `🔢 Submit "Data Issue"`,
    getLink: (_: Course) => `${githubIssuesUrl}/new?assignees=apalchys&labels=&template=data-issue-report.md&title=`,
    access: combine(isCourseNotCompleted, anyAccess),
  },
  // {
  //   name: `➡️ Assign Tasks`,
  //   getLink: (course: Course) => `/course/admin/task-assign?course=${course.alias}`,
  //   access: combine(isCourseNotCompleted, isAdmin),
  // },
];

class IndexPage extends React.PureComponent<Props, State> {
  state: State = {
    dropdownOpen: false,
    activeCourseId: null,
  };

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
    const { isAdmin } = this.props.session;

    return routes
      .filter(route => route.access(course, role, isAdmin))
      .map(route => ({
        name: route.name,
        link: route.getLink(course),
      }));
  };

  private getCourses() {
    const { session, courses } = this.props;
    if (!session || !courses) {
      return [];
    }
    const { isAdmin } = session;
    return courses.filter(course => session.roles[course.id] || isAdmin).sort((a, b) => b.alias.localeCompare(a.alias));
  }

  private getActiveCourse() {
    const courses = this.getCourses();
    if (courses.length === 0) {
      return null;
    }
    if (this.state.activeCourseId == null) {
      return courses[0];
    }
    return courses.find(course => course.id === this.state.activeCourseId);
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

  renderNoCourse() {
    const hasPlanned = (this.props.courses || []).some(course => course.status === 'planned');
    return (
      <Alert color="warning" style={{ fontSize: '1rem' }}>
        <div>You are not student or mentor in any active course</div>
        {hasPlanned ? (
          <div>
            You can <a href="/course/registry">register here</a> to the upcoming course
          </div>
        ) : (
          <div>Unfortunately, there are no any planned courses for now.</div>
        )}
      </Alert>
    );
  }

  render() {
    const { isAdmin } = this.props.session;
    const activeCourse = this.getActiveCourse();
    return (
      <div>
        <ActivityBanner />
        <Header username={this.props.session.githubId} />

        <div className="m-3">
          {!activeCourse && this.renderNoCourse()}
          <Nav className="mb-3">
            {isAdmin && (
              <NavItem>
                <a href="/admin/tasks">All Tasks</a>
              </NavItem>
            )}
            {isAdmin && (
              <NavItem>
                <a href="/admin/users">All Users</a>
              </NavItem>
            )}
          </Nav>
          {activeCourse && (
            <Dropdown
              isOpen={this.state.dropdownOpen}
              toggle={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
            >
              <DropdownToggle style={{ fontSize: '1rem' }} caret>
                {activeCourse.name} ({activeCourse.status})
              </DropdownToggle>
              <DropdownMenu>
                {this.getCourses().map(course => (
                  <DropdownItem onClick={() => this.setState({ activeCourseId: course.id })} key={course.id}>
                    {course.name} ({course.status})
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {activeCourse && this.getLinks(activeCourse).map(this.renderLink)}
          {/* {links} */}
          {/* {this.renderLink({ name: 'Course Registry', link: '/course/registry' })} */}
          {/*
          {this.props.session.isAdmin && <div>{this.renderLink({ name: 'All Tasks', link: '/admin/tasks' })}</div>}
          {this.props.session.isAdmin && <div>{this.renderLink({ name: 'All Users', link: '/admin/users' })}</div>} */}
        </div>
      </div>
    );
  }
}

type LinkInfo = { name: string; link: string };

export default withCourses(withSession(IndexPage));
