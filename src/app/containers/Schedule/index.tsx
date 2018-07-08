import * as React from 'react';
import { connect } from 'react-redux';

import Schedule from 'components/Schedule';
import { fetchEventsAndStages, addStage } from 'core/actions';
import { IEventDocument, IStage, IStageDocument } from 'core/models';
import './index.scss';

const mapStateToProps = (state: any, props: any): ScheduleContainerProps => {
    return {
        ...props,
        isLoading: state.schedule.isLoading,
        stages: state.schedule.stages,
        events: state.schedule.events,
        courseId: props.match.params.id,
        isAdmin: state.user.isAdmin,
    };
};

const mapDispatchToProps = (dispatch: any, props: any): ScheduleContainerProps => {
    return {
        ...props,
        onLoad: id => {
            dispatch(fetchEventsAndStages(id));
        },
        addStage: (stage: IStage) => {
            dispatch(addStage(stage));
        },
    };
};

type ScheduleContainerProps = {
    stages: IStageDocument[];
    events: IEventDocument[];
    onLoad: (id: string) => void;
    addStage: (stage: IStage) => void;
    courseId: string;
    isLoading: boolean;
    isAdmin: boolean;
};

class ScheduleContainer extends React.Component<ScheduleContainerProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        const { events, stages, isAdmin, isLoading } = this.props;
        return (
            <div className="schedule">
                <h1 className="schedule-title">Schedule</h1>
                {isLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <Schedule stages={stages} isAdmin={isAdmin} events={events} addStage={this.props.addStage} />
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ScheduleContainer);
