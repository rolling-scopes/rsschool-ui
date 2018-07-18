import * as React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FormGroup, Row } from 'reactstrap';

import { IEventDocument, IEvent, IStageDocument, IStage, EventType } from 'core/models';
import ScheduleStage from './ScheduleStage';
import ScheduleEvent from './ScheduleEvent';
import ModalStage, { StageFormData } from './ModalStage';
import ModalEvent, { EventFormData } from './ModalEvent';
import ModalDelete from './ModalDelete';
import { INPUT_DATE_FORMAT, DELETE_STAGE_CONTEXT, INPUT_DATE_TIME_FORMAT } from 'core/constants';

type ScheduleProps = {
    courseId: string;
    stages: IStageDocument[];
    events: IEventDocument[];
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
    constructor(props: ScheduleProps) {
        super(props);

        this.state = {
            stage: undefined,
            event: undefined,
            isOpenModalStage: false,
            isOpenModalEvent: false,
            isOpenModalDelete: false,
            deleteContext: undefined,
            eventType: undefined,
            isCopyEvent: false,
        };
    }

    toggleOpenModalStage = (stage?: IStageDocument) => () => {
        this.setState({ stage, isOpenModalStage: !this.state.isOpenModalStage });
    };

    toggleOpenModalEvent = (
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

    toggleOpenModalDeleteStage = (deleteContext?: DeleteContext, stage?: IStageDocument) => () => {
        this.setState({ stage, deleteContext, isOpenModalDelete: !this.state.isOpenModalDelete });
    };

    handleSubmitStage = ({ title, startDate, endDate }: StageFormData) => {
        const { stage } = this.state;
        const { courseId } = this.props;
        const data = {
            title: title.trim(),
            startDate: Number(moment(startDate)),
            endDate: Number(moment(endDate)),
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
        descriptionFileUrl,
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
            startDateTime: Number(moment(startDateTime)),
            endDateTime: endDateTime ? Number(moment(endDateTime)) : undefined,
            location: location && location.trim(),
            trainer: trainer && trainer.trim(),
            whoChecks: whoChecks,
            descriptionFileUrl: descriptionFileUrl && descriptionFileUrl.trim(),
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
                startDate: moment(stage.startDate).format(INPUT_DATE_FORMAT),
                endDate: moment(stage.endDate).format(INPUT_DATE_FORMAT),
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
                startDateTime: moment(event.startDateTime).format(INPUT_DATE_TIME_FORMAT),
                endDateTime: event.endDateTime ? moment(event.endDateTime).format(INPUT_DATE_TIME_FORMAT) : undefined,
                location: event.location,
                trainer: event.trainer,
                whoChecks: event.whoChecks,
                descriptionFileUrl: event.descriptionFileUrl,
            }
        );
    };

    render() {
        const { isAdmin, stages, events } = this.props;
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
                            <Button color="success" onClick={this.toggleOpenModalEvent(EventType.Session)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Session
                            </Button>{' '}
                            <Button color="success" onClick={this.toggleOpenModalEvent(EventType.Task)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Task
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                {stages.map((stg, index) => {
                    return (
                        <ScheduleStage
                            key={index}
                            stage={stg}
                            isAdmin={isAdmin}
                            onEditStage={this.toggleOpenModalStage(stg)}
                            onDeleteStage={this.toggleOpenModalDeleteStage(DELETE_STAGE_CONTEXT, stg)}
                        />
                    );
                })}
                <div className="schedule-desc">
                    {events.map((evnt, index) => {
                        return (
                            <ScheduleEvent
                                key={index}
                                event={evnt}
                                isAdmin={isAdmin}
                                onEditEvent={console.log}
                                onCopyEvent={console.log}
                                onDeleteEvent={console.log}
                            />
                        );
                    })}
                </div>
                {isAdmin ? (
                    <Row className="text-center mt-5">
                        <FormGroup className="col-md-12">
                            <Button outline={true} color="secondary" onClick={this.toggleOpenModalStage()}>
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
