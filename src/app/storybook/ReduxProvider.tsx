import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../core/store';

export class ReduxProvider extends React.Component<any> {
    store: any;

    constructor(props: any) {
        super(props);
        this.store = configureStore({} as any);
    }

    render() {
        return <Provider store={this.store} {...this.props} />;
    }
}
