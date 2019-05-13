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
      return (
        <div>
          <Header username={this.state.profile.firstName} />
          <div className="profile_container">
            <div className="profile_section">
                <div className="profile_label">Name and Surname</div>
                <div className="profile_value">
                    {this.state.profile.firstNameNative} {this.state.profile.lastNameNative}
                </div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Name and Surname as in passport</div>
                <div className="profile_value">{this.state.profile.firstName} {this.state.profile.lastName}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Location</div>
                <div className="profile_value">{this.state.profile.locationName}</div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Github</div>
                <div className="profile_value">
                <a href={`https://github.com/${this.state.profile.githubId}`} >
                    {`https://github.com/${this.state.profile.githubId}`}
                </a>
                </div>
            </div>
            <div className="profile_section">
                <div className="profile_label">Contacts</div>
                <div className="profile_value">
                    <a href={`tel:${this.state.profile.contactsPhone}`} >
                        {this.state.profile.contactsPhone}
                    </a>
                    <br/>
                    <a href={`malito:${this.state.profile.contactsEmail}`} >
                        {this.state.profile.contactsEmail}
                    </a>
                </div>
            </div>
            <div className="profile_section">
                <div className="profile_label">English level</div>
                <div className="profile_value">{this.state.profile.englishLevel}</div>
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
