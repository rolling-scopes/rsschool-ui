import * as React from 'react';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Form, FormGroup, Button, FormText } from 'reactstrap';

import { IEventDocument, EventType, TaskType, SessionType, WhoChecks } from 'core/models';
import { requiredFieldError, requiredFieldSuccess, urlFieldError } from 'core/validation';
import ReduxFormInput from 'components/ReduxFormInput';
import { INPUT_DATE_TIME_FORMAT } from 'core/constants';

type ModalEventProps = {
    event: IEventDocument | undefined;
    eventType: EventType;
    isCopy: boolean;
    isOpen: boolean;
    onCloseModal: () => void;
    startDateTime?: string;
    endDateTime?: string;
};

export type EventFormData = {
    title: string;
    taskType?: TaskType;
    sessionType?: SessionType;
    startDateTime: string;
    endDateTime?: string;
    location?: string;
    trainer?: string;
    whoChecks?: WhoChecks;
    urlToDescription?: string;
};

class ModalEvent extends React.PureComponent<ModalEventProps & InjectedFormProps<EventFormData, ModalEventProps>> {
    onCloseModal = () => {
        this.props.reset();
        this.props.onCloseModal();
    };

    getModalTitle = () => {
        const { eventType, event, isCopy } = this.props;
        switch (eventType) {
            case EventType.Session: {
                if (isCopy) {
                    return 'Copy Session';
                }
                return event ? 'Edit Session' : 'New Session';
            }
            case EventType.Task: {
                if (isCopy) {
                    return 'Copy Task';
                }
                return event ? 'Edit Task' : 'New Task';
            }

            default: {
                return 'Event';
            }
        }
    };

    render() {
        const { isOpen, handleSubmit, pristine, submitting, eventType, startDateTime, endDateTime } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={this.onCloseModal} size="lg">
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={this.onCloseModal}>{this.getModalTitle()}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Field
                                name="title"
                                label="Title"
                                placeholder="Task Title"
                                component={ReduxFormInput}
                                required={true}
                                type="text"
                                validate={[requiredFieldError]}
                                warn={requiredFieldSuccess}
                            />
                        </FormGroup>
                        {eventType === EventType.Task ? (
                            <FormGroup>
                                <Field
                                    label="Task Type"
                                    name="taskType"
                                    placeholder="Task Type"
                                    component={ReduxFormInput}
                                    type="select"
                                    required={true}
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                >
                                    {Object.values(TaskType).map(taskType => (
                                        <option key={taskType} value={taskType}>
                                            {taskType}
                                        </option>
                                    ))}
                                </Field>
                            </FormGroup>
                        ) : null}
                        {eventType === EventType.Session ? (
                            <FormGroup>
                                <Field
                                    label="Session Type"
                                    name="sessionType"
                                    placeholder="Session Type"
                                    component={ReduxFormInput}
                                    type="select"
                                    required={true}
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                >
                                    {Object.values(SessionType).map(sessionType => (
                                        <option key={sessionType} value={sessionType}>
                                            {sessionType}
                                        </option>
                                    ))}
                                </Field>
                            </FormGroup>
                        ) : null}
                        <FormGroup row={true}>
                            <FormGroup className="col-md-6">
                                <Field
                                    name="startDateTime"
                                    label="Start Date Time"
                                    component={ReduxFormInput}
                                    required={true}
                                    type="datetime-local"
                                    max={
                                        endDateTime
                                            ? DateTime.fromISO(endDateTime).toFormat(INPUT_DATE_TIME_FORMAT)
                                            : undefined
                                    }
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                />
                            </FormGroup>
                        </FormGroup>
                        {eventType === EventType.Task ? (
                            <React.Fragment>
                                <FormGroup row={true}>
                                    <FormGroup className="col-md-6">
                                        <Field
                                            name="endDateTime"
                                            label="End Date Time"
                                            component={ReduxFormInput}
                                            required={true}
                                            type="datetime-local"
                                            min={
                                                startDateTime
                                                    ? DateTime.fromISO(startDateTime).toFormat(INPUT_DATE_TIME_FORMAT)
                                                    : undefined
                                            }
                                            validate={[requiredFieldError]}
                                            warn={requiredFieldSuccess}
                                        />
                                    </FormGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Field
                                        label="Who checks"
                                        name="whoChecks"
                                        placeholder="Who checks"
                                        component={ReduxFormInput}
                                        type="select"
                                        required={true}
                                        validate={[requiredFieldError]}
                                        warn={requiredFieldSuccess}
                                    >
                                        {Object.values(WhoChecks).map(whoCheck => (
                                            <option key={whoCheck} value={whoCheck}>
                                                {whoCheck}
                                            </option>
                                        ))}
                                    </Field>
                                </FormGroup>
                            </React.Fragment>
                        ) : null}
                        {eventType === EventType.Session ? (
                            <React.Fragment>
                                <FormGroup>
                                    <Field
                                        name="location"
                                        label="Location"
                                        placeholder={
                                            "like: 'Str. Akadеmіka Kup...' or 'https://attendee.gototraining.com...'"
                                        }
                                        component={ReduxFormInput}
                                        required={true}
                                        type="text"
                                        validate={[requiredFieldError]}
                                        warn={requiredFieldSuccess}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field
                                        name="trainer"
                                        label="Trainer"
                                        placeholder="Trainer"
                                        component={ReduxFormInput}
                                        required={true}
                                        type="text"
                                        validate={[requiredFieldError]}
                                        warn={requiredFieldSuccess}
                                    />
                                </FormGroup>
                            </React.Fragment>
                        ) : null}
                        <FormGroup>
                            <Field
                                name="urlToDescription"
                                label="URL to GitHub Markdown File with session description"
                                placeholder="http://..."
                                component={ReduxFormInput}
                                required={eventType === EventType.Task}
                                type="text"
                                validate={
                                    eventType === EventType.Task ? [requiredFieldError, urlFieldError] : urlFieldError
                                }
                                warn={eventType === EventType.Task ? requiredFieldSuccess : undefined}
                            />
                            <FormText color="muted">
                                Please create markdown file with session description in the following directory{' '}
                                <a href="https://github.com/rolling-scopes-school/lectures">
                                    https://github.com/rolling-scopes-school/lectures
                                </a>{' '}
                                and provide URL link to that file.
                            </FormText>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row className="text-right">
                            <FormGroup className="col-md-12">
                                <Button color="secondary" onClick={this.onCloseModal}>
                                    Cancel
                                </Button>{' '}
                                <Button color="success" type="submit" disabled={pristine || submitting}>
                                    Save
                                </Button>
                            </FormGroup>
                        </Row>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state: any, props: any): ModalEventProps {
    return {
        ...props,
        startDateTime: (state.form.eventForm || {}).values ? state.form.eventForm.values.startDateTime : undefined,
        endDateTime: (state.form.eventForm || {}).values ? state.form.eventForm.values.endDateTime : undefined,
    };
}

export default reduxForm<EventFormData, ModalEventProps>({
    form: 'eventForm',
    enableReinitialize: true,
})(
    connect(
        mapStateToProps,
        null,
    )(ModalEvent),
);
