import * as React from 'react';
import Link from 'next/link';

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
          <p className="header-logged-user">
            <Link href={{ pathname: '/profile' }}>
              <a>My Profile</a>
            </Link>
          </p>
        </div>
      </nav>
    );
  }
}

export default Header;
