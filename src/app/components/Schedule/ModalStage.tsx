import * as React from 'react';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Form, FormGroup, Button } from 'reactstrap';

import { IStageDocument } from 'core/models';
import { requiredFieldError, requiredFieldSuccess } from 'core/validation';
import ReduxFormInput from 'components/ReduxFormInput';
import { INPUT_DATE_FORMAT } from 'core/constants';

type ModalStageProps = {
    stage: IStageDocument | undefined;
    isOpen: boolean;
    onCloseModal: () => void;
    startDate?: string;
    endDate?: string;
};

export type StageFormData = {
    title: string;
    startDate: string;
    endDate: string;
};

class ModalStage extends React.PureComponent<ModalStageProps & InjectedFormProps<StageFormData, ModalStageProps>> {
    onCloseModal = () => {
        this.props.reset();
        this.props.onCloseModal();
    };

    render() {
        const { isOpen, stage, handleSubmit, pristine, submitting, startDate, endDate } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={this.onCloseModal}>
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={this.onCloseModal}>{stage ? 'Edit Stage' : 'New Stage'}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Field
                                name="title"
                                label="Title"
                                placeholder="Stage #1"
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
                                    name="startDate"
                                    label="Start Date"
                                    placeholder="17-01-2018"
                                    component={ReduxFormInput}
                                    required={true}
                                    type="date"
                                    max={endDate ? DateTime.fromISO(endDate).toFormat(INPUT_DATE_FORMAT) : undefined}
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Field
                                    name="endDate"
                                    label="End Date"
                                    placeholder="17-04-2018"
                                    component={ReduxFormInput}
                                    required={true}
                                    type="date"
                                    min={
                                        startDate ? DateTime.fromISO(startDate).toFormat(INPUT_DATE_FORMAT) : undefined
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

function mapStateToProps(state: any, props: any): ModalStageProps {
    return {
        ...props,
        startDate: (state.form.stageForm || {}).values ? state.form.stageForm.values.startDate : undefined,
        endDate: (state.form.stageForm || {}).values ? state.form.stageForm.values.endDate : undefined,
    };
}

export default reduxForm<StageFormData, ModalStageProps>({
    form: 'stageForm',
    enableReinitialize: true,
})(
    connect(
        mapStateToProps,
        null,
    )(ModalStage),
);
