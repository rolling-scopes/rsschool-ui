import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FormGroup, Row } from 'reactstrap';

import { IEventDocument, IStageDocument, IStage } from 'core/models';
import ScheduleStage from './ScheduleStage';
import ModalStage from './ModalStage';

type ScheduleProps = {
    stages: IStageDocument[];
    events: IEventDocument[];
    isAdmin: boolean;
    addStage: (stage: IStage) => void;
};

type ScheduleState = {
    stage: IStageDocument | undefined;
    isOpenModalStage: boolean;
};

class Schedule extends React.PureComponent<ScheduleProps, ScheduleState> {
    constructor(props: ScheduleProps) {
        super(props);

        this.state = {
            stage: undefined,
            isOpenModalStage: false,
        };
    }

    toggleOpenModalStage = (stage?: IStageDocument) => () => {
        this.setState({ stage, isOpenModalStage: !this.state.isOpenModalStage });
    };

    render() {
        const { isAdmin, stages } = this.props;
        const { stage, isOpenModalStage } = this.state;
        return (
            <React.Fragment>
                {isAdmin ? (
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
                {stages.map((stage, index) => {
                    return <ScheduleStage key={index} stage={stage} isAdmin={isAdmin} />;
                })}
                {isAdmin ? (
                    <Row className="text-center mt-5">
                        <FormGroup className="col-md-12">
                            <Button outline={true} color="secondary" onClick={this.toggleOpenModalStage()}>
                                <FontAwesomeIcon icon={faPlus} /> Add Stage
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                <ModalStage isOpen={isOpenModalStage} stage={stage} toggle={this.toggleOpenModalStage()} />
            </React.Fragment>
        );
    }
}

export default Schedule;
