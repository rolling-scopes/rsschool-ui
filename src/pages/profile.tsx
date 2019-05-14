import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import Login from '../components/Login';
import { LoadingScreen } from '../components/LoadingScreen';
import Router from 'next/router';
import { withRouter } from 'next/router';

import '../index.scss';

type Props = {
  router: any;
  session: any;
};

type State = {
  profile: any;
  isLoading: boolean;
};

class ProfilePage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    profile: null,
  };

  async componentDidMount() {
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

  renderProfile() {
    if (this.state.profile) {
      const { profile } =  this.state;
      const studentCourses = profile.students.map((data: any) => data.course.name);
      const mentorCourses = profile.mentors.map((data: any) => data.course.name);
      const mentorStudents = profile.mentors.map((data: any) => `${data.user.firstName} ${data.user.lastName}`);
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
                <div className="profile_value">{profile.firstName} {profile.lastName}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Location</div>
                <div className="profile_value">{profile.locationName}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Github</div>
                <div className="profile_value">
                <a href={`https://github.com/${profile.githubId}`} >
                    {`https://github.com/${profile.githubId}`}
                </a>
                </div>
            </div>
            <div className="profile_section">
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
            </div>
            <div className="profile_section">
                <div className="profile_label">External accounts</div>
                <div className="profile_value">{profile.externalAccounts.join(', ')}</div>
            </div>
            <div className="profile_header">Mentee Information</div>
            <div className="profile_section">
                <div className="profile_label">Courses</div>
                <div className="profile_value">{studentCourses.join(', ')}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Education</div>
                <div className="profile_value">{profile.educationHistory.join(', ')}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Employment history</div>
                <div className="profile_value">{profile.employmentHistory.join(', ')}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Estimated english level</div>
                <div className="profile_value">
                    {profile.englishLevel ? profile.englishLevel.toUpperCase() : null}
                </div>
            </div>
            <div className="profile_section">
                <div className="profile_label">CV</div>
                <div className="profile_value">
                    <a href={`${profile.cvUrl}`} >
                        {profile.cvUrl}
                    </a>
                </div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Fulltime ready</div>
                <div className="profile_value">{profile.readyFullTime}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Mentor</div>
                <div className="profile_value" />
            </div>
            <div className="profile_header">Mentor Information</div>
            <div className="profile_section">
                <div className="profile_label">Courses</div>
                <div className="profile_value">{mentorCourses.join(', ')}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Students</div>
                <div className="profile_value">{mentorStudents.join(', ')}</div>
            </div>
        </div>
    </div>);
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
