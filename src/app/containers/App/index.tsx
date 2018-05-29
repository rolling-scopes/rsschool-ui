import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Admin from '../Admin';
import Courses from '../Courses';
import Events from '../Events';
import Home from '../Home';
import Layout from '../Layout';
import Profile from '../Profile';

const App = (): JSX.Element => {
    return (
        <Switch>
            <Layout>
                <Route exact={true} path="/" render={() => <Redirect to="/home" />} />
                <Route exact={true} path="/home" component={Home} />
                <Route exact={true} path="/courses" component={Courses} />

                <Route exact={true} path="/course/:id/events" component={Events} />
                <Route exact={true} path="/profile" component={Profile} />
                <Route exact={true} path="/admin" component={Admin} />
            </Layout>
        </Switch>
    );
};

export default App;
