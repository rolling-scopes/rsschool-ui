import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPencilAlt, faTrashAlt, faMapMarkerAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardBody, Row, Col, Button, Badge, Collapse } from 'reactstrap';

import { IEventDocument } from 'core/models';

type ScheduleEventProps = {
    event: IEventDocument;
    isAdmin: boolean;
    onEditEvent: () => void;
    onCopyEvent: () => void;
    onDeleteEvent: () => void;
};

type ScheduleEventState = {
    collapse: boolean;
};

class ScheduleEvent extends React.PureComponent<ScheduleEventProps, ScheduleEventState> {
    constructor(props: ScheduleEventProps) {
        super(props);

        this.state = {
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    render() {
        const {
            isAdmin,
            event: { title },
        } = this.props;
        const { collapse } = this.state;

        return (
            <Card className="past">
                <CardHeader>
                    <h5 className="mb-0">
                        <Button color="link" onClick={this.toggle}>
                            <Row>
                                <Col xs="2">
                                    <Badge color="info" pill={true}>
                                        <FontAwesomeIcon icon={faGlobe} /> Online
                                    </Badge>
                                </Col>
                                <Col xs="2">March 19, 2018</Col>
                                <Col xs="1">Fri</Col>
                                <Col xs="1">20:00</Col>
                                <Col xs="4">Web Typography</Col>
                                <Col xs="2">Саша Герасимов </Col>
                            </Row>
                        </Button>
                    </h5>
                </CardHeader>
                <Collapse isOpen={collapse}>
                    <CardBody>
                        {isAdmin ? (
                            <div className="text-right">
                                <Button title="Copy" size="sm" color="secondary" onClick={this.props.onCopyEvent}>
                                    <FontAwesomeIcon icon={faCopy} /> Copy
                                </Button>
                                <Button title="Edit" size="sm" color="secondary" onClick={this.props.onEditEvent}>
                                    <FontAwesomeIcon icon={faPencilAlt} /> Edit
                                </Button>
                                <Button title="Delete" size="sm" color="secondary" onClick={this.props.onDeleteEvent}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                </Button>
                            </div>
                        ) : null}
                        <h4>{title}</h4>
                        <p>
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Location:
                            <a href="#">test</a>
                        </p>

                        <p>test</p>
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}

export default ScheduleEvent;
