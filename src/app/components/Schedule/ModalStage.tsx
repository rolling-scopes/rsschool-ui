import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, FormGroup, Button } from 'reactstrap';

import { IStageDocument } from 'core/models';

type ModalAddStageProps = {
    stage: IStageDocument | undefined;
    isOpen: boolean;
    toggle: () => void;
};

class ModalStage extends React.PureComponent<ModalAddStageProps> {
    render() {
        const { isOpen, toggle, stage } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{stage ? 'Edit Stage' : 'New Stage'}</ModalHeader>
                <ModalBody>Stage</ModalBody>
                <ModalFooter>
                    <Row className="text-right">
                        <FormGroup className="col-md-12">
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>{' '}
                            <Button color="success" onClick={toggle}>
                                Save
                            </Button>
                        </FormGroup>
                    </Row>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalStage;
