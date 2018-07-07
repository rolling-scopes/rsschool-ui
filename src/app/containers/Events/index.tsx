import * as React from 'react';
import { connect } from 'react-redux';

import Schedule from 'components/Schedule';
import { fetchEvents } from 'core/actions';
import { IEvent, IStage } from 'core/models/events';
import './index.scss';

const mapStateToProps = (state: any, props: any): EventsProps => {
    return {
        ...props,
        isLoading: state.events.isLoading,
        stages: state.events.stages,
        events: state.events.data,
        courseId: props.match.params.id,
        isAdmin: state.user.isAdmin,
    };
};

const mapDispatchToProps = (dispatch: any, props: any): EventsProps => {
    return {
        ...props,
        onLoad: id => {
            dispatch(fetchEvents(id));
        },
    };
};

type EventsProps = {
    stages: IStage[];
    events: IEvent[];
    onLoad: (id: string) => void;
    courseId: string;
    isLoading: boolean;
    isAdmin: boolean;
};

class Events extends React.Component<EventsProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        const events = this.props != null ? this.props.events : [];
        return (
            <div className="events">
                <h1 className="events-title">Events</h1>
                {this.props.isLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <Schedule stages={this.props.stages} isAdmin={this.props.isAdmin} events={events} />
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Events);
