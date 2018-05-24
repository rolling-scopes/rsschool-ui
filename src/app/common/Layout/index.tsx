import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSession } from '../../core/actions';
import Header from '../Header';

interface Props {
    children: React.ReactNode;
    isLoggedIn?: boolean;
    onLoad?: () => void;
}

const mapStateToProps = (state: any, props: Props): Partial<Props> => {
    return {
        ...props,
        isLoggedIn: state.session.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch: any, props: Props): Partial<Props> => {
    return {
        ...props,
        onLoad: () => {
            dispatch(fetchSession());
        },
    };
};

class Layout extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <div>
                    <Header />
                    <div>{this.props.children}</div>
                </div>
            );
        }
        return (
            <div>
                <a href="/api/auth/github">Login</a>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
