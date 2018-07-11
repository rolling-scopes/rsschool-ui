import * as React from 'react';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Form, FormGroup, Button } from 'reactstrap';

import { IStageDocument } from 'core/models';
import { requiredFieldError, requiredFieldSuccess } from 'core/validation';
import ReduxFormInput from 'components/ReduxFormInput';

type ModalAddStageProps = {
    stage: IStageDocument | undefined;
    isOpen: boolean;
    toggle: () => void;
};

export type StageFormData = {
    title: string;
    startDate: string;
    endDate: string;
};

// TODO: implement Date validation

class ModalStage extends React.PureComponent<
    ModalAddStageProps & InjectedFormProps<StageFormData, ModalAddStageProps>
> {
    closeModal = () => {
        this.props.reset();
        this.props.toggle();
    };

    render() {
        const { isOpen, toggle, stage, handleSubmit, pristine, submitting } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={this.closeModal}>
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={toggle}>{stage ? 'Edit Stage' : 'New Stage'}</ModalHeader>
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
                                    validate={[requiredFieldError]}
                                    warn={requiredFieldSuccess}
                                />
                            </FormGroup>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row className="text-right">
                            <FormGroup className="col-md-12">
                                <Button color="secondary" onClick={this.closeModal}>
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

export default reduxForm<StageFormData, ModalAddStageProps>({
    form: 'stageForm',
})(ModalStage);
