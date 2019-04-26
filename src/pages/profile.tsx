import * as React from 'react';
import Header from '../components/Header';
import * as fetch from 'isomorphic-fetch';
import Login from '../components/Login';
import LoadingScreen from '../components/LoadingScreen';
import Router from 'next/router';
import { withRouter } from 'next/router';

import '../index.scss';

type Props = {
    router: any,
};

type State = {
    // githubId?: string;
    profile: any,
    isLoading: boolean;
};

class ProfilePage extends React.Component<Props, State> {
    state: State = {
        isLoading: true,
        profile: null,
    };

    async componentDidMount() {
        const { router } = this.props;

        const response = await fetch(`api/profile?githubId=${router.query.githubId}`);

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
              <Header username={this.state.profile.githubId} />
              <div>{this.state.profile.githubId}</div>
              <div>{this.state.profile.firstName} {this.state.profile.lastName}</div>
              <div>{this.state.profile.firstNameNative} {this.state.profile.lastNameNative}</div>
              <div>{this.state.profile.englishLevel}</div>
              <div>{this.state.profile.contactsPhone}</div>
              <div>{this.state.profile.contactsEmail}</div>
              <div>{this.state.profile.locationName}</div>
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

    renderLoading() {
        if (this.state.isLoading) {
            return <LoadingScreen show={true} />;
        }
        return null;
    }

    render() {
        return (
            <>
                {this.renderLoading()}
                {this.renderLogin()}
                {this.renderProfile()}
            </>
        )
    }
}

export default withRouter(ProfilePage);
