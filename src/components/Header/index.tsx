import * as React from 'react';

import './index.scss';

type Props = {
  username: string;
};

class Header extends React.Component<Props, any> {
  render() {
    return (
      <nav className="navbar navbar-light header-nav">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img className="header-logo" src="/static/images/logo-rsschool.svg" alt="Rolling Scopes School Logo" />
          </a>
          <p className="header-logged-user">Hello, {this.props.username}</p>
        </div>
      </nav>
    );
  }
}

export default Header;
