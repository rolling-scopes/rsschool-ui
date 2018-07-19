import * as React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Badge } from 'reactstrap';

import { IStageDocument } from 'core/models';
import { STAGE_DATE_FORMAT } from 'core/constants';

const formatDate = (date: number) => moment(date).format(STAGE_DATE_FORMAT);

type ScheduleStageProps = {
    stage: IStageDocument;
    isAdmin: boolean;
    onEditStage: () => void;
    onDeleteStage: () => void;
};

class ScheduleStage extends React.PureComponent<ScheduleStageProps> {
    render() {
        const {
            isAdmin,
            stage: { title, startDate, endDate },
        } = this.props;
        return (
            <h3 className="text-center">
                <Badge color="primary">{title}</Badge>{' '}
                <Badge color="secondary">{`${formatDate(startDate)} - ${formatDate(endDate)}`}</Badge>
                {isAdmin ? (
                    <React.Fragment>
                        <Button title="Edit" size="sm" color="secondary" onClick={this.props.onEditStage}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Edit
                        </Button>
                        <Button title="Delete" size="sm" color="secondary" onClick={this.props.onDeleteStage}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </Button>
                    </React.Fragment>
                ) : null}
            </h3>
        );
    }
}

export default ScheduleStage;
