import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Layout from '../../common/Layout';
import Admin from '../Admin';
import Events from '../Events';
import Home from '../Home';
import Profile from '../Profile';

const App = (): JSX.Element => {
    return (
        <Switch>
            <Layout>
                <Route exact={true} path="/" render={() => <Redirect to="/home" />} />
                <Route exact={true} path="/home" component={Home} />
                <Route path="/course/:id/events" component={Events} />
                <Route path="/profile" component={Profile} />
                <Route path="/admin" component={Admin} />
            </Layout>
        </Switch>
    );
};

export default App;
