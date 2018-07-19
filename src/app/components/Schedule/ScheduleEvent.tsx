import * as React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGlobe,
    faPencilAlt,
    faTrashAlt,
    faMapMarkerAlt,
    faCopy,
    faMapMarker,
    faBookOpen,
    faGift,
    faListOl,
    faMicrophoneAlt,
    faHourglassStart,
} from '@fortawesome/free-solid-svg-icons';
import { faHotjar } from '@fortawesome/free-brands-svg-icons';
import { Card, CardHeader, CardBody, Row, Col, Button, Badge, Collapse } from 'reactstrap';

import { IEventDocument, EventType, SessionType, TaskType } from 'core/models';
import { classNames } from 'core/styles';
import { EVENT_DATE_FORMAT, EVENT_DAY_FORMAT, EVENT_TIME_FORMAT } from 'core/constants';

const cn = classNames(require('./index.scss'));

const BADGE_COLOR_MAP = {
    [EventType.Session]: 'info',
    [EventType.Task]: 'warning',
};

const BADGE_ICON_MAP = {
    [SessionType.Online]: faGlobe,
    [SessionType.Offline]: faMapMarker,
    [SessionType.SelfLearning]: faBookOpen,
    [SessionType.ExtraEvent]: faGift,
    [TaskType.CodeJam]: faHotjar,
    [TaskType.Test]: faListOl,
    [TaskType.Interview]: faMicrophoneAlt,
    [TaskType.Task]: faHourglassStart,
    default: faGlobe,
};

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
            event: {
                type,
                title,
                trainer,
                startDateTime,
                taskType,
                sessionType,
                whoChecks,
                location,
                descriptionFileUrl,
            },
        } = this.props;
        const { collapse } = this.state;

        return (
            <Card className={cn('card', { past: true })}>
                <CardHeader className={cn('card-header')}>
                    <h5 className="mb-0">
                        <Button className={cn('btn', 'btn-link')} color="link" onClick={this.toggle}>
                            <Row className={cn('row')}>
                                <Col xs="2">
                                    <Badge
                                        className={cn('badge', 'badge-pill')}
                                        color={BADGE_COLOR_MAP[type]}
                                        pill={true}
                                    >
                                        <FontAwesomeIcon icon={BADGE_ICON_MAP[taskType || sessionType || 'default']} />
                                        {` ${taskType || sessionType}`}
                                    </Badge>
                                </Col>
                                <Col xs="2">{moment(startDateTime).format(EVENT_DATE_FORMAT)}</Col>
                                <Col xs="1">{moment(startDateTime).format(EVENT_DAY_FORMAT)}</Col>
                                <Col xs="1">{moment(startDateTime).format(EVENT_TIME_FORMAT)}</Col>
                                <Col xs="4">{title}</Col>
                                <Col xs="2">{trainer || whoChecks}</Col>
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
                        {location ? (
                            <p>
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Location: <a href="#">{location}</a>
                            </p>
                        ) : null}
                        {descriptionFileUrl ? (
                            <p>
                                <a href={descriptionFileUrl}>{descriptionFileUrl}</a>
                            </p>
                        ) : null}
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}

export default ScheduleEvent;
