import * as React from 'react';
import { DateTime } from 'luxon';
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
import isUrl = require('is-url');

import { IEventDocument, EventType, SessionType, TaskType } from 'core/models';
import { classNames } from 'core/styles';
import { EVENT_DATE_FORMAT, EVENT_DAY_FORMAT, EVENT_TIME_FORMAT } from 'core/constants';

const cn = classNames(require('./index.scss'));

const BADGE_COLOR_MAP = {
    [EventType.Session]: 'info',
    [EventType.Task]: 'warning',
};

const DEFAULT = 'default';

const BADGE_ICON_MAP = {
    [SessionType.Online]: faGlobe,
    [SessionType.Offline]: faMapMarker,
    [SessionType.SelfLearning]: faBookOpen,
    [SessionType.ExtraEvent]: faGift,
    [TaskType.CodeJam]: faHotjar,
    [TaskType.Test]: faListOl,
    [TaskType.Interview]: faMicrophoneAlt,
    [TaskType.Task]: faHourglassStart,
    [DEFAULT]: faGlobe,
};

type ScheduleEventProps = {
    event: IEventDocument;
    isEndTask: boolean;
    isAdmin: boolean;
    onEditEvent: () => void;
    onCopyEvent: () => void;
    onDeleteEvent: () => void;
};

type ScheduleEventState = {
    collapse: boolean;
};

class ScheduleEvent extends React.PureComponent<ScheduleEventProps, ScheduleEventState> {
    state: ScheduleEventState = {
        collapse: false,
    };

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    render() {
        const {
            isAdmin,
            isEndTask,
            event: {
                type,
                title,
                trainer,
                startDateTime,
                endDateTime,
                taskType,
                sessionType,
                whoChecks,
                location,
                urlToDescription,
            },
        } = this.props;
        const { collapse } = this.state;
        const dateTime: number = isEndTask ? endDateTime! : startDateTime;
        return (
            <Card
                className={cn('card', {
                    past: DateTime.local().startOf('day') > DateTime.fromMillis(dateTime).startOf('day'),
                })}
            >
                <CardHeader className={cn('card-header')}>
                    <h5 className="mb-0">
                        <Button className={cn('btn', 'btn-link')} color="link" onClick={this.toggle}>
                            <Row className={cn('row')}>
                                <Col xs="2">
                                    <Badge
                                        className={cn('badge', 'badge-pill')}
                                        color={isEndTask ? 'danger' : BADGE_COLOR_MAP[type]}
                                        pill={true}
                                    >
                                        <FontAwesomeIcon icon={BADGE_ICON_MAP[taskType || sessionType || DEFAULT]} />
                                        {` ${taskType || sessionType}`}
                                    </Badge>
                                </Col>
                                <Col xs="2">{DateTime.fromMillis(dateTime).toFormat(EVENT_DATE_FORMAT)}</Col>
                                <Col xs="1">{DateTime.fromMillis(dateTime).toFormat(EVENT_DAY_FORMAT)}</Col>
                                <Col xs="1">{DateTime.fromMillis(dateTime).toFormat(EVENT_TIME_FORMAT)}</Col>
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
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Location:{' '}
                                {isUrl(location) ? (
                                    <a target="_blank" href={location}>
                                        {location}
                                    </a>
                                ) : (
                                    location
                                )}
                            </p>
                        ) : null}
                        {urlToDescription ? (
                            <p>
                                <a target="_blank" href={urlToDescription}>
                                    {urlToDescription}
                                </a>
                            </p>
                        ) : null}
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}

export default ScheduleEvent;
