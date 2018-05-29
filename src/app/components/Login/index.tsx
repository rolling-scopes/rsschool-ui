import { classNames } from 'core/styles';
import * as React from 'react';

const cn = classNames(require('./index.scss'));

class Login extends React.Component {
    render() {
        return (
            <main>
                <div className={cn('login-form')}>
                    <img className={cn('login-image')} src="/assets/images/logo-rsschool2.png" alt="RS Logo" />
                    <div className="text-right mt-5 pt-5">
                        <a href="/api/auth/github" className="btn btn-success">
                            Sign up with GitHub
                        </a>
                    </div>
                </div>
                <div className="container">
                    <div className={cn('row', 'partner-list')}>
                        <div className="col-4 d-flex align-items-center">
                            <a href="https://epam.by/">
                                <img
                                    className={cn('partner-image')}
                                    src="/assets/images/logo-epam.svg"
                                    alt="EPAM logo"
                                />
                            </a>
                        </div>
                        <div className="col-4 d-flex align-items-center">
                            <a href="https://github.com/">
                                <img
                                    className={cn('partner-image')}
                                    src="/assets/images/logo-github.png"
                                    alt="Github logo"
                                />
                            </a>
                        </div>
                        <div className="col-4 d-flex align-items-center">
                            <a href="https://imaguru.co/">
                                <img
                                    className={cn('partner-image')}
                                    src="/assets/images/logo-imaguru.svg"
                                    alt="Imaguru logo"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Login;
