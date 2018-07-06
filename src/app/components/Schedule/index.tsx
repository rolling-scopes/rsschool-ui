import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FormGroup, Row } from 'reactstrap';

import { IEvent } from 'core/models/events';

type ScheduleProps = {
    events: IEvent[];
    isAdmin: boolean;
};

class Schedule extends React.PureComponent<ScheduleProps> {
    render() {
        return (
            <React.Fragment>
                {this.props.isAdmin ? (
                    <Row className="text-right mb-4 mt-3">
                        <FormGroup className="col-md-12">
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Session
                            </Button>{' '}
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Task
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
            </React.Fragment>
        );
    }
}

export default Schedule;
