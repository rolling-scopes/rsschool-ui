import Login from 'components/Login';
import { fetchSession } from 'core/actions';
import { RootState } from 'core/reducers';
import { classNames } from 'core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Header from '../Header';
import { WithLoader } from '../../components/HOCS';

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
        isLoading: state.user.isLoading,
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

    render() {
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

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    WithLoader('onLoad'),
)(Layout) as React.ComponentType;
