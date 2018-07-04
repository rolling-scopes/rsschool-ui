import Login from 'components/Login';
import { fetchSession } from 'core/actions';
import { RootState } from 'core/reducers';
import { classNames } from 'core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import Header from '../Header';

const cn = classNames(require('./index.scss'));

interface Props {
    children: React.ReactNode;
    isLoggedIn?: boolean;
    isLoading?: boolean;
    onLoad?: () => void;
}

const mapStateToProps = (state: RootState, props: Props): Partial<Props> => {
    return {
        ...props,
        isLoggedIn: state.user.isLoggedIn,
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
        if (this.props.isLoading) {
            return <div>Loading...</div>;
        }

        if (this.props.isLoggedIn) {
            return [
                <Header key="header" />,
                <main key="main" className={cn('container', 'main-container')}>
                    {this.props.children}
                </main>,
            ];
        }

        return <Login />;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Layout);
