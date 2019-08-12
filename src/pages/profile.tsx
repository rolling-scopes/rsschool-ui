import * as React from 'react';
import { Table, Button } from 'reactstrap';
import { Header } from 'components/Header';
import axios from 'axios';
import { LoadingScreen } from '../components/LoadingScreen';
import { withRouter, RouterProps } from 'next/router';
import withSession, { Session } from '../components/withSession';

import '../index.scss';
import Link from 'next/link';

type Props = {
  router: RouterProps;
  session: Session;
};

type State = {
  profile: any;
  isLoading: boolean;
  user: { id: number; githubId: string } | null;
};

class ProfilePage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    profile: null,
    user: null,
  };

  constructor(props: Readonly<Props>) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    this.setState({ isLoading: true });

    const { router } = this.props;

    try {
      const githubId = router.query ? (router.query.githubId as string) : null;
      const response = githubId
        ? await axios.get(`api/profile`, { params: { githubId } })
        : await axios.get(`api/profile/me`);

      const profile = response.data.data;
      const user = githubId ? { id: profile.id, githubId } : null;
      this.setState({ isLoading: false, profile, user });
    } catch (e) {
      this.setState({ isLoading: false, profile: null });
    }
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: { router: { query?: any } }) {
    if (prevProps.router.query.githubId !== this.props.router.query!.githubId) {
      await this.fetchData();
    }
  }

  renderProfile() {
    if (!this.state.profile) {
      return (
        <div>
          <Header username={this.props.session.githubId} />
          <h2 className="m-4">No Access</h2>
        </div>
      );
    }
    const { profile } = this.state;

    const mentorCourses = profile.mentors.map((data: any) => data.course.name);
    const mentorStudents = profile.mentors
      .map((data: any) =>
        data.students.map((s: any) => ({
          githubId: s.user.githubId,
          name: `${s.user.firstName} ${s.user.lastName}`,
        })),
      )
      .reduce((acc: any, v: any) => acc.concat(v), []);

    return (
      <div>
        <Header username={this.props.session.githubId} />
        <div className="profile_container">
          {this.renderGeneralInfo(profile)}
          {this.renderBadges(profile)}
          {this.renderStudentProfile(profile)}

          <div className="profile_header">Mentor Profile</div>
          <div className="profile_section">
            <div className="profile_label">Courses</div>
            <div className="profile_value">{mentorCourses.join(', ')}</div>
          </div>
          <div className="profile_section">
            <div className="profile_label">Students</div>
            <div className="profile_value">
              {mentorStudents.map((st: any, i: any) => (
                <span key={i}>
                  <Link href={{ pathname: '/profile', query: { githubId: st.githubId } }}>
                    <a>{st.name}</a>
                  </Link>
                  {i !== mentorStudents.length - 1 ? <span>{', '}</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.session) {
      return null;
    }
    return (
      <>
        <LoadingScreen show={this.state.isLoading}>{this.renderProfile()}</LoadingScreen>
      </>
    );
  }

  private renderGeneralInfo(profile: any) {
    const user = this.state.user;
    return (
      <>
        <div className="profile_header">General Information</div>
        <div className="profile_section">
          <div className="profile_value profile-avatar-action">
            <img width="64" height="64" src={`https://github.com/${profile.githubId}.png`} />
            <div className="spacer" />
            {!user ? (
              <Button
                onClick={() => {
                  this.props.router.push('/profile-edit');
                }}
                color="primary"
                className="profile-action-edit"
              >
                Edit
              </Button>
            ) : (
              <Button
                onClick={() => {
                  this.props.router.push(`/private-feedback?githubId=${user.githubId}&userId=${user.id}`);
                }}
                color="primary"
                className="profile-action-edit"
              >
                Leave Private Feedback
              </Button>
            )}
            <div className="ml-3" />
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Name and Surname</div>
          <div className="profile_value">
            {profile.firstNameNative} {profile.lastNameNative}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Name and Surname as in passport</div>
          <div className="profile_value">
            {profile.firstName} {profile.lastName}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Location</div>
          <div className="profile_value">{profile.locationName}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Github</div>
          <div className="profile_value">
            <a href={`https://github.com/${profile.githubId}`}>{`https://github.com/${profile.githubId}`}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Contacts</div>
          <div className="profile_value">
            <a href={`tel:${profile.contactsPhone}`}>{profile.contactsPhone}</a>
            <br />
            <a href={`mailto:${profile.contactsEmail}`}>{profile.contactsEmail}</a>
            <a href={`mailto:${profile.contactsEpamEmail}`}>{profile.contactsEpamEmail}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Education</div>
          <div className="profile_value">
            {profile.educationHistory
              .filter((edh: any) => edh.university || edh.faculty)
              .map((edh: any, i: number) => (
                <div key={i}>
                  <div>Graduation Year: {edh.graduationYear}</div>
                  <div>University: {edh.university}</div>
                  <div>Faculty: {edh.faculty}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Employment history</div>
          <div className="profile_value">{profile.employmentHistory.join(', ')}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Estimated english level</div>
          <div className="profile_value">{profile.englishLevel ? profile.englishLevel.toUpperCase() : null}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">CV</div>
          <div className="profile_value">
            <a href={`${profile.cvUrl}`}>{profile.cvUrl}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">External accounts</div>
          <div className="profile_value">
            {profile.externalAccounts
              .filter((exta: any) => exta.username)
              .map((exta: any) => `Service: ${exta.service} Name: ${exta.username}`)}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Fulltime ready</div>
          <div className="profile_value">{profile.readyFullTime}</div>
        </div>
      </>
    );
  }

  private renderStudentProfile(profile: any) {
    if (!profile.students || profile.students.length === 0) {
      return (
        <>
          <div className="profile_header">Student Profile</div>
          <div className="profile_section">No Data</div>
        </>
      );
    }
    return (
      <>
        <div className="profile_header">Student Profile</div>
        {profile.students.map((student: any, i: number) => {
          const mentor = student.mentor;
          const tasks = student.taskResults;
          const feedback = student.feedback;
          return (
            <div key={i}>
              <div className="profile_subheader">{student.course.name}</div>
              <div className="profile_section">
                <div className="profile_label">Mentor</div>
                <div className="profile_value">
                  <span key={mentor.githubId}>
                    <Link key={mentor.githubId} href={{ pathname: '/profile', query: { githubId: mentor.githubId } }}>
                      <a>
                        {mentor.firstName} {mentor.lastName}{' '}
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
              {tasks.length > 0 && (
                <div className="profile_section">
                  <Table className="profile-task-table mt-3">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Score</th>
                        <th>PR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks
                        .sort((a: any, b: any) =>
                          a.studentEndDate ? a.studentEndDate.localeCompare(b.studentEndDate) : -1,
                        )
                        .map((t: any, i: any) => {
                          return (
                            <tr key={i}>
                              <th>
                                {t.task.descriptionUrl ? (
                                  <a href={t.task.descriptionUrl}>{t.task.name}</a>
                                ) : (
                                  t.task.name
                                )}
                              </th>
                              <td>{t.score}</td>
                              <td>{t.githubPrUrl ? <a href={t.githubPrUrl}>{t.githubPrUrl}</a> : t.githubPrUrl}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              )}
              {(feedback as { comment: string }[]).map((f, i) => (
                <div key={i}>
                  <div className="profile_section">
                    <div className="profile_label">Comment </div>
                    <div className="profile_value">{f.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  }

  private renderBadges(profile: any) {
    const receivedFeedback: {
      fromUser: number;
      toUser: number;
      comment: string;
      badgeId: string;
    }[] = profile.receivedFeedback;

    if (receivedFeedback.length === 0) {
      return (
        <>
          <div className="profile_header">#gratitude</div>
          <div className="profile_section">No Data</div>
        </>
      );
    }
    return (
      <>
        <div className="profile_header">#gratitude</div>
        {receivedFeedback.map((feedback, i) => (
          <div key={i}>
            <div className="profile_section">
              <div className="profile_label">Comment</div>
              <div className="profile_value">
                {feedback.comment} ({feedback.badgeId})
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(withSession(ProfilePage));
