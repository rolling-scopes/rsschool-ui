import * as React from 'react';
import { connect } from 'react-redux';

import Schedule from 'components/Schedule';
import {
    fetchEventsAndStages,
    addStage,
    updateStage,
    deleteStage,
    addEvent,
    updateEvent,
    deleteEvent,
} from 'core/actions';
import { NormalizeScheduleData } from 'core/helpers';
import { IEvent, IEventDocument, IStage, IStageDocument } from 'core/models';
import './index.scss';

const mapStateToProps = (state: any, props: any): ScheduleContainerProps => {
    return {
        ...props,
        isLoading: state.schedule.isLoading,
        courseId: props.match.params.id,
        isAdmin: state.user.isAdmin,
        normalizeData: state.schedule.normalizeData,
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
        updateStage: (stage: IStageDocument) => {
            dispatch(updateStage(stage));
        },
        deleteStage: (id: string) => {
            dispatch(deleteStage(id));
        },
        addEvent: (event: IEvent) => {
            dispatch(addEvent(event));
        },
        updateEvent: (event: IEventDocument) => {
            dispatch(updateEvent(event));
        },
        deleteEvent: (id: string) => {
            dispatch(deleteEvent(id));
        },
    };
};

type ScheduleContainerProps = {
    normalizeData: NormalizeScheduleData[];
    onLoad: (id: string) => void;
    addStage: (stage: IStage) => void;
    updateStage: (stage: IStageDocument) => void;
    deleteStage: (id: string) => void;
    addEvent: (event: IEvent) => void;
    updateEvent: (event: IEventDocument) => void;
    deleteEvent: (id: string) => void;
    courseId: string;
    isLoading: boolean;
    isAdmin: boolean;
};

class ScheduleContainer extends React.Component<ScheduleContainerProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        const { normalizeData, isAdmin, courseId } = this.props;
        return (
            <div className="schedule">
                <h2>Schedule</h2>
                {
                    <Schedule
                        courseId={courseId}
                        normalizeData={normalizeData}
                        isAdmin={isAdmin}
                        addStage={this.props.addStage}
                        updateStage={this.props.updateStage}
                        deleteStage={this.props.deleteStage}
                        addEvent={this.props.addEvent}
                        updateEvent={this.props.updateEvent}
                        deleteEvent={this.props.deleteEvent}
                    />
                }
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ScheduleContainer);
