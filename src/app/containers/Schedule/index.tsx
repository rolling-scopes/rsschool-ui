import * as React from 'react';
import { connect } from 'react-redux';

import ScheduleContainer from 'components/ScheduleContainer';
import { fetchEventsAndStages } from 'core/actions';
import { IEvent, IStage } from 'core/models';
import './index.scss';

const mapStateToProps = (state: any, props: any): ScheduleProps => {
    return {
        ...props,
        isLoading: state.schedule.isLoading,
        stages: state.schedule.stages,
        events: state.schedule.events,
        courseId: props.match.params.id,
        isAdmin: state.user.isAdmin,
    };
};

const mapDispatchToProps = (dispatch: any, props: any): ScheduleProps => {
    return {
        ...props,
        onLoad: id => {
            dispatch(fetchEventsAndStages(id));
        },
    };
};

type ScheduleProps = {
    stages: IStage[];
    events: IEvent[];
    onLoad: (id: string) => void;
    courseId: string;
    isLoading: boolean;
    isAdmin: boolean;
};

class Schedule extends React.Component<ScheduleProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        const events = this.props != null ? this.props.events : [];
        return (
            <div className="schedule">
                <h1 className="schedule-title">Schedule</h1>
                {this.props.isLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <ScheduleContainer stages={this.props.stages} isAdmin={this.props.isAdmin} events={events} />
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Schedule);
