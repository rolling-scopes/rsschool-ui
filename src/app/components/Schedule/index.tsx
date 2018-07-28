import * as React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FormGroup, Row } from 'reactstrap';

import { IEventDocument, IEvent, IStageDocument, IStage, EventType } from 'core/models';
import { classNames } from 'core/styles';
import { NormalizeScheduleData } from 'core/helpers';
import ScheduleStage from './ScheduleStage';
import ScheduleEvent from './ScheduleEvent';
import ModalStage, { StageFormData } from './ModalStage';
import ModalEvent, { EventFormData } from './ModalEvent';
import ModalDelete from './ModalDelete';
import {
    INPUT_DATE_FORMAT,
    DELETE_STAGE_CONTEXT,
    DELETE_STAGE_ERROR_CONTEXT,
    INPUT_DATE_TIME_FORMAT,
    DELETE_EVENT_CONTEXT,
} from 'core/constants';

const cn = classNames(require('./index.scss'));

type ScheduleProps = {
    courseId: string;
    normalizeData: NormalizeScheduleData[];
    isAdmin: boolean;
    addStage: (stage: IStage) => void;
    updateStage: (stage: IStageDocument) => void;
    deleteStage: (id: string) => void;
    addEvent: (event: IEvent) => void;
    updateEvent: (event: IEventDocument) => void;
    deleteEvent: (id: string) => void;
};

type DeleteContext = {
    title: string;
    body: string;
    isError: boolean;
};

type ScheduleState = {
    stage: IStageDocument | undefined;
    event: IEventDocument | undefined;
    isOpenModalStage: boolean;
    isOpenModalEvent: boolean;
    isOpenModalDelete: boolean;
    deleteContext: DeleteContext | undefined;
    eventType: EventType | undefined;
    isCopyEvent: boolean;
};

class Schedule extends React.PureComponent<ScheduleProps, ScheduleState> {
    state: ScheduleState = {
        stage: undefined,
        event: undefined,
        isOpenModalStage: false,
        isOpenModalEvent: false,
        isOpenModalDelete: false,
        deleteContext: undefined,
        eventType: undefined,
        isCopyEvent: false,
    };

    toggleModalStage = (stage?: IStageDocument) => () => {
        this.setState({ stage, isOpenModalStage: !this.state.isOpenModalStage });
    };

    toggleModalEvent = (
        eventType: EventType,
        event: IEventDocument | undefined = undefined,
        isCopyEvent: boolean = false,
    ) => () => {
        this.setState({ eventType, event, isCopyEvent, isOpenModalEvent: !this.state.isOpenModalEvent });
    };

    onCloseModalStage = () => {
        this.setState({
            stage: undefined,
            isOpenModalStage: false,
        });
    };

    onCloseModalEvent = () => {
        this.setState({
            event: undefined,
            isOpenModalEvent: false,
            eventType: undefined,
            isCopyEvent: false,
        });
    };

    onCloseModalDelete = () => {
        this.setState({
            stage: undefined,
            event: undefined,
            deleteContext: undefined,
            isOpenModalDelete: false,
        });
    };

    toggleModalDeleteStage = (deleteContext: DeleteContext, stage: IStageDocument) => () => {
        this.setState({ stage, deleteContext, isOpenModalDelete: !this.state.isOpenModalDelete });
    };

    toggleModalDeleteEvent = (deleteContext: DeleteContext, event: IEventDocument) => () => {
        this.setState({ event, deleteContext, isOpenModalDelete: !this.state.isOpenModalDelete });
    };

    handleSubmitStage = ({ title, startDate, endDate }: StageFormData) => {
        const { stage } = this.state;
        const { courseId } = this.props;
        const data = {
            title: title.trim(),
            startDate: DateTime.fromISO(startDate).toMillis(),
            endDate: DateTime.fromISO(endDate).toMillis(),
            courseId,
        };
        if (stage != null) {
            this.props.updateStage({ ...stage, ...data });
        } else {
            this.props.addStage(data);
        }
        this.onCloseModalStage();
    };

    handleSubmitEvent = ({
        title,
        taskType,
        sessionType,
        startDateTime,
        endDateTime,
        location,
        trainer,
        whoChecks,
        urlToDescription,
    }: EventFormData) => {
        const { event, eventType, isCopyEvent } = this.state;
        const { courseId } = this.props;

        if (!eventType) {
            return;
        }

        const data = {
            courseId,
            type: eventType,
            title: title.trim(),
            taskType: taskType,
            sessionType: sessionType,
            startDateTime: DateTime.fromISO(startDateTime).toMillis(),
            endDateTime: endDateTime ? DateTime.fromISO(endDateTime).toMillis() : undefined,
            location: location && location.trim(),
            trainer: trainer && trainer.trim(),
            whoChecks: whoChecks,
            urlToDescription: urlToDescription && urlToDescription.trim(),
        };

        if (event != null) {
            if (isCopyEvent) {
                this.props.addEvent(data);
            } else {
                this.props.updateEvent({ ...event, ...data });
            }
        } else {
            this.props.addEvent(data);
        }
        this.onCloseModalEvent();
    };

    handleDelete = () => {
        const { stage, event } = this.state;
        if (stage != null) {
            this.props.deleteStage(stage._id);
        } else if (event != null) {
            this.props.deleteEvent(event._id);
        }
    };

    getInitialStage = (): StageFormData | undefined => {
        const { stage } = this.state;
        return (
            stage && {
                title: stage.title,
                startDate: DateTime.fromMillis(stage.startDate).toFormat(INPUT_DATE_FORMAT),
                endDate: DateTime.fromMillis(stage.endDate).toFormat(INPUT_DATE_FORMAT),
            }
        );
    };

    getInitialEvent = (): EventFormData | undefined => {
        const { event } = this.state;
        return (
            event && {
                title: event.title,
                taskType: event.taskType,
                sessionType: event.sessionType,
                startDateTime: DateTime.fromMillis(event.startDateTime).toFormat(INPUT_DATE_TIME_FORMAT),
                endDateTime: event.endDateTime
                    ? DateTime.fromMillis(event.endDateTime).toFormat(INPUT_DATE_TIME_FORMAT)
                    : undefined,
                location: event.location,
                trainer: event.trainer,
                whoChecks: event.whoChecks,
                urlToDescription: event.urlToDescription,
            }
        );
    };

    render() {
        const { isAdmin, normalizeData } = this.props;
        const {
            stage,
            event,
            isOpenModalStage,
            isOpenModalEvent,
            isOpenModalDelete,
            deleteContext,
            eventType,
            isCopyEvent,
        } = this.state;

        return (
            <React.Fragment>
                {isAdmin ? (
                    <Row className="text-right mb-4 mt-3">
                        <FormGroup className="col-md-12">
                            <Button color="success" onClick={this.toggleModalEvent(EventType.Session)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Session
                            </Button>{' '}
                            <Button color="success" onClick={this.toggleModalEvent(EventType.Task)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Task
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                {normalizeData.map((data, index) => {
                    return (
                        <React.Fragment key={index}>
                            {data.stage ? (
                                <ScheduleStage
                                    stage={data.stage}
                                    isAdmin={isAdmin}
                                    onEditStage={this.toggleModalStage(data.stage)}
                                    onDeleteStage={this.toggleModalDeleteStage(
                                        data.events.length > 0 ? DELETE_STAGE_ERROR_CONTEXT : DELETE_STAGE_CONTEXT,
                                        data.stage,
                                    )}
                                />
                            ) : null}
                            {data.events && data.events.length > 0 ? (
                                <div className={cn('schedule-desc')}>
                                    {data.events.map(({ isEndTask, event: evnt }, index) => {
                                        return (
                                            <ScheduleEvent
                                                key={index}
                                                event={evnt}
                                                isEndTask={isEndTask}
                                                isAdmin={isAdmin}
                                                onEditEvent={this.toggleModalEvent(evnt.type, evnt)}
                                                onCopyEvent={this.toggleModalEvent(evnt.type, evnt, true)}
                                                onDeleteEvent={this.toggleModalDeleteEvent(DELETE_EVENT_CONTEXT, evnt)}
                                            />
                                        );
                                    })}
                                </div>
                            ) : null}
                        </React.Fragment>
                    );
                })}
                {isAdmin ? (
                    <Row className="text-center mt-5">
                        <FormGroup className="col-md-12">
                            <Button outline={true} color="secondary" onClick={this.toggleModalStage()}>
                                <FontAwesomeIcon icon={faPlus} /> Add Stage
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                <ModalStage
                    isOpen={isOpenModalStage}
                    stage={stage}
                    onCloseModal={this.onCloseModalStage}
                    initialValues={this.getInitialStage()}
                    onSubmit={this.handleSubmitStage}
                />
                {eventType ? (
                    <ModalEvent
                        isOpen={isOpenModalEvent}
                        isCopy={isCopyEvent}
                        event={event}
                        eventType={eventType}
                        onCloseModal={this.onCloseModalEvent}
                        initialValues={this.getInitialEvent()}
                        onSubmit={this.handleSubmitEvent}
                    />
                ) : null}
                {deleteContext ? (
                    <ModalDelete
                        {...deleteContext}
                        isOpen={isOpenModalDelete}
                        onCloseModal={this.onCloseModalDelete}
                        handleDelete={this.handleDelete}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

export default Schedule;
