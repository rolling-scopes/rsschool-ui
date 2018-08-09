import * as React from 'react';

import LoadingScreen from '../LoadingScreen';

const WithLoader = (loadingFunctionName: string | null) => (WrappedComponent: React.ComponentType) =>
    class extends React.Component<any, any> {
        componentDidMount() {
            if (loadingFunctionName) {
                this.props[loadingFunctionName]();
            }
        }

        render() {
            return this.props.isLoading ? <LoadingScreen /> : <WrappedComponent {...this.props} />;
        }
    };

export default WithLoader;
