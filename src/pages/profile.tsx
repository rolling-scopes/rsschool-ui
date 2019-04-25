import * as React from 'react';
import Header from '../components/Header';
// import * as fetch from 'isomorphic-fetch';
import Login from '../components/Login';
import LoadingScreen from '../components/LoadingScreen';
// import Router from 'next/router';

import '../index.scss';

type Props = {
    githubId: string;
};

type State = {
    // githubId?: string;
    isLoading: boolean;
};

class ProfilePage extends React.Component<Props, State> {
    state: State = {
        isLoading: true,
    };

    // async componentDidMount() {
    //     await fetch(`/api/users?githubId=${this.props.githubId}`);

    //     // if (!response.ok) {
    //     //   Router.push('/login');
    //     //   return;
    //     // }

    //     // const json = await response.json();

    //     this.setState({
    //       isLoading: false,
    //     });
    // }

    renderProfile() {
        if (this.props.githubId) {
          return (
            <div>
              <Header username={this.props.githubId} />
              <div>Hey, I'm noname</div>
            </div>
          );
        }
        return null;
    }

    renderLogin() {
        if (!this.props.githubId && !this.state.isLoading) {
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
                {/* {this.renderLoading()}
                {this.renderLogin()} */}
                {this.renderProfile()}
            </>
        )
    }
}

export default ProfilePage;
