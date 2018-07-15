import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

type ModalDeleteProps = {
    isOpen: boolean;
    onCloseModal: () => void;
    handleDelete: () => void;
    title: string;
    body: string;
    isError: boolean;
};

class ModalDelete extends React.PureComponent<ModalDeleteProps> {
    render() {
        const { isOpen, onCloseModal, handleDelete, title, body, isError } = this.props;
        return (
            <Modal fade={true} centered={true} isOpen={isOpen} toggle={onCloseModal}>
                <ModalHeader toggle={onCloseModal}>{title}</ModalHeader>
                <ModalBody>{body}</ModalBody>
                <ModalFooter>
                    {isError ? (
                        <Button color="secondary" onClick={onCloseModal}>
                            Ok
                        </Button>
                    ) : (
                        <React.Fragment>
                            <Button color="secondary" onClick={handleDelete}>
                                Yes
                            </Button>{' '}
                            <Button color="primary" onClick={onCloseModal}>
                                No
                            </Button>
                        </React.Fragment>
                    )}
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalDelete;
