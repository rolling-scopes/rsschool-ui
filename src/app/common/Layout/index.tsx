import * as React from 'react';

import Header from '../Header';

interface Props {
    children: React.ReactNode;
}

const Layout = (props: Props) => {
    return (
        <div>
            <Header />
            <div>{props.children}</div>
        </div>
    );
};

export default Layout;
