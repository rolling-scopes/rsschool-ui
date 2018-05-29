import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Admin from '../admin';
import Events from '../events';
import Home from '../home';
import Layout from '../layout';
import Profile from '../profile';

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
