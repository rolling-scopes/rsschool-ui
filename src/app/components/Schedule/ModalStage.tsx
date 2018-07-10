import * as React from 'react';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Form, FormGroup, Button } from 'reactstrap';

import { IStageDocument } from 'core/models';
import ReduxFormInputText from 'components/ReduxFormInputText';

type ModalAddStageProps = {
    stage: IStageDocument | undefined;
    isOpen: boolean;
    toggle: () => void;
};

type FormData = {
    title: string;
    startDate: number;
    endDate: number;
};

class ModalStage extends React.PureComponent<ModalAddStageProps & InjectedFormProps<FormData, ModalAddStageProps>> {
    render() {
        const { isOpen, toggle, stage, handleSubmit, pristine, submitting } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={toggle}>
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={toggle}>{stage ? 'Edit Stage' : 'New Stage'}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Field
                                name="title"
                                // className="form-control"
                                label="Title"
                                placeholder="Stage #1"
                                component={ReduxFormInputText}
                                required={true}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row className="text-right">
                            <FormGroup className="col-md-12">
                                <Button color="secondary" onClick={toggle}>
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

export default reduxForm<FormData, ModalAddStageProps>({
    form: 'stageForm',
})(ModalStage);
