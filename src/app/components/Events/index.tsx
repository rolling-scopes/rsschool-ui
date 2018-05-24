import * as React from 'react';
import { connect } from 'react-redux';
import { fetchEvents } from '../../core/actions';
import { IEvent } from '../../core/models/events';

import './index.scss';

const mapStateToProps = (state: any, props: any): EventsProps => {
    return {
        ...props,
        isLoading: state.events.isLoading,
        events: state.events.data,
        courseId: props.match.params.id,
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
    events: IEvent[];
    onLoad: (id: string) => void;
    courseId: string;
    isLoading: boolean;
};

class Events extends React.Component<EventsProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        const events = this.props != null ? this.props.events : [];
        return (
            <div className="Events">
                <h1 className="Events-title">Events</h1>
                {this.props.isLoading ? (
                    <h2>Loading...</h2>
                ) : (
                    events.map((event, key) => (
                        <div key={key}>
                            {event.stage}: {event.name}
                        </div>
                    ))
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);
