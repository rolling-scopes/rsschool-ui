import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import Login from '../components/Login';
import { LoadingScreen } from '../components/LoadingScreen';
import Router from 'next/router';
import { withRouter } from 'next/router';

import '../index.scss';
import Link from 'next/link';

type Props = {
  router: any;
  session: any;
};

type State = {
  profile: any;
  isLoading: boolean;
};

const TASK_LABELS = {
  description: 'Description',
  score: 'Score',
  githubPrUrl: 'Pull request',
  comment: 'Comment',
};

class ProfilePage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    profile: null,
  };

  constructor(props: Readonly<Props>) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    this.setState({
      isLoading: true,
    });

    const { router } = this.props;

    const response = await fetch(`api/profile?githubId=${router.query.githubId}`, { credentials: 'same-origin' });

    if (!response.ok) {
      Router.push('/login');
      return;
    }

    const json = await response.json();

    this.setState({
      isLoading: false,
      profile: json.data,
    });
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: { router: { query: { githubId: any } } }) {
    if (prevProps.router.query.githubId !== this.props.router.query.githubId) {
      await this.fetchData();
    }
  }

  renderProfile() {
    if (this.state.profile) {
      const { profile } = this.state;
      const studentCourses = profile.students.map((data: any) => data.course.name);
      const studentTasks = profile.students
        .map((data: any) => data.taskResults)
        .reduce((acc: any, v: any) => acc.concat(v), [])
        .map((v: any) => Object.keys(v).map(k => ({ label: k, value: v[k] })))
        .reduce((acc: any, v: any) => acc.concat(v), [])
        .filter((v: { label: any }) => TASK_LABELS.hasOwnProperty(`${v.label}`));
      const mentorCourses = profile.mentors.map((data: any) => data.course.name);
      const studentMentor = profile.students
        .filter((f: any) => !!f.mentor)
        .map((data: any) => ({
          githubId: data.mentor.user.githubId,
          name: `${data.mentor.user.firstName} ${data.mentor.user.lastName}`,
        }));
      // tslint:disable-next-line:max-line-length
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
          <Header username={profile.firstName} />
          <div className="profile_container">
            <div className="profile_header">General Information</div>
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
            {/* <div className="profile_section">
                <div className="profile_label">Contacts</div>
                <div className="profile_value">
                    <a href={`tel:${profile.contactsPhone}`} >
                        {profile.contactsPhone}
                    </a>
                    <br/>
                    <a href={`mailto:${profile.contactsEmail}`} >
                        {profile.contactsEmail}
                    </a>
                    <a href={`mailto:${profile.contactsEpamEmail}`} >
                        {profile.contactsEpamEmail}
                    </a>
                </div>
            </div> */}
            <div className="profile_section">
              <div className="profile_label">External accounts</div>
              <div className="profile_value">
                  {profile.externalAccounts
                        .filter((f: any) => f.service)
                        .map((exta: any) => `Service: ${exta.service} Name: ${exta.username}`)}
              </div>
            </div>
            <div className="profile_header">Mentee Information</div>
            <div className="profile_section">
              <div className="profile_label">Courses</div>
              <div className="profile_value">{studentCourses.join(', ')}</div>
            </div>
            <div className="profile_section">
              <div className="profile_label">Education</div>
              <div className="profile_value">
                  {profile.educationHistory.map(
                    // tslint:disable-next-line:max-line-length
                    (edh: any) => `Graduation Year: ${edh.graduationYear} University: ${edh.university} Faculty: ${edh.faculty} `,
                  )}
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
              <div className="profile_label">Fulltime ready</div>
              <div className="profile_value">{profile.readyFullTime}</div>
            </div>
            <div className="profile_section">
              <div className="profile_label">Mentor</div>
              <div className="profile_value">
                {studentMentor.map((st: any, i: any) => (
                  <span key={st.githubId}>
                    <Link key={st.githubId} href={{ pathname: '/profile', query: { githubId: st.githubId } }}>
                      <a>{st.name}</a>
                    </Link>
                    {i !== studentMentor.length - 1 ? <span>{', '}</span> : null}
                  </span>
                ))}
              </div>
            </div>
            <div className="profile_header">Tasks Information</div>
            {studentTasks.map((st: any, i: any) => (
              <div key={i} className="profile_section">
                <div className="profile_label">{TASK_LABELS[`${st.label}` as keyof typeof TASK_LABELS]}</div>
                <div className="profile_value">{st.value}</div>
              </div>
            ))}
            <div className="profile_section">
              <div className="profile_label">Score</div>
              <div className="profile_value" />
            </div>
            <div className="profile_section">
              <div className="profile_label">Comment</div>
              <div className="profile_value" />
            </div>
            <div className="profile_section">
              <div className="profile_label">Pull Request</div>
              <div className="profile_value" />
            </div>
            <div className="profile_header">Mentor Information</div>
            <div className="profile_section">
              <div className="profile_label">Courses</div>
              <div className="profile_value">{mentorCourses.join(', ')}</div>
            </div>
            <div className="profile_section">
              <div className="profile_label">Students</div>
              <div className="profile_value">
                {mentorStudents.map((st: any, i: any) => (
                  <span key={st.githubId}>
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
    return null;
  }

  renderLogin() {
    if (!this.state.profile && !this.state.isLoading) {
      return <Login />;
    }
    return null;
  }

  render() {
    return (
      <>
        <LoadingScreen show={this.state.isLoading}>
          {this.renderLogin()}
          {this.renderProfile()}
        </LoadingScreen>
      </>
    );
  }
}

export default withRouter(ProfilePage);
