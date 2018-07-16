import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Form, FormGroup, Button } from 'reactstrap';

import { IEventDocument, EventType } from 'core/models';
import { requiredFieldError, requiredFieldSuccess } from 'core/validation';
import ReduxFormInput from 'components/ReduxFormInput';
import { INPUT_DATE_TIME_FORMAT } from 'core/constants';

type ModalEventProps = {
    event: IEventDocument | undefined;
    eventType: EventType;
    isOpen: boolean;
    onCloseModal: () => void;
    startDateTime?: string;
    endDateTime?: string;
};

export type EventFormData = {
    title: string;
    startDateTime: string;
    endDateTime: string;
};

class ModalEvent extends React.PureComponent<ModalEventProps & InjectedFormProps<EventFormData, ModalEventProps>> {
    onCloseModal = () => {
        this.props.reset();
        this.props.onCloseModal();
    };

    render() {
        const { isOpen, handleSubmit, pristine, submitting, startDateTime, endDateTime } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={this.onCloseModal} size="lg">
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={this.onCloseModal}>New Task</ModalHeader>
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
                        <FormGroup row={true}>
                            <FormGroup className="col-md-6">
                                <Field
                                    name="startDateTime"
                                    label="Start Date Time"
                                    component={ReduxFormInput}
                                    required={true}
                                    type="datetime-local"
                                    max={endDateTime ? moment(endDateTime).format(INPUT_DATE_TIME_FORMAT) : undefined}
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Field
                                    name="endDateTime"
                                    label="End Date Time"
                                    component={ReduxFormInput}
                                    required={true}
                                    type="datetime-local"
                                    min={
                                        startDateTime ? moment(startDateTime).format(INPUT_DATE_TIME_FORMAT) : undefined
                                    }
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                />
                            </FormGroup>
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
