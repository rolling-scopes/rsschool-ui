import { fetchEvents } from 'core/actions';
import { IEvent } from 'core/models/events';
import * as React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Badge } from 'reactstrap';
import './index.scss';

const mapStateToProps = (state: any, props: any): EventsProps => {
    return {
        ...props,
        isLoading: state.events.isLoading,
        events: state.events.data,
        courseId: props.match.params.id,
        isAdmin: state.user.isAdmin,
    };
};

const mapDispatchToProps = (dispatch: any, props: any): EventsProps => {
    return {
        ...props,
        onLoad: id => {
            dispatch(fetchEvents(id));
        },
    };
};

type EventsProps = {
    events: IEvent[];
    onLoad: (id: string) => void;
    courseId: string;
    isLoading: boolean;
    isAdmin: boolean;
};

class Events extends React.Component<EventsProps, any> {
    componentDidMount() {
        this.props.onLoad(this.props.courseId);
    }

    render() {
        // const events = this.props != null ? this.props.events : [];
        return (
            <div className="events">
                <h1 className="events-title">Events</h1>
                {this.props.isAdmin ? (
                    <div className="row text-right mb-4 mt-3">
                        <div className="form-group col-md-12">
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Session
                            </Button>{' '}
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Task
                            </Button>
                        </div>
                    </div>
                ) : null}
                <h3 className="text-center">
                    <Badge color="primary">Stage #1</Badge> <Badge color="secondary">16.01.2018 - 16.03.2018</Badge>
                    {this.props.isAdmin ? (
                        <React.Fragment>
                            <Button title="Edit" size="sm" color="secondary" onClick={console.log}>
                                <FontAwesomeIcon icon={faPencilAlt} /> Edit
                            </Button>
                            <Button title="Delete" size="sm" color="secondary" onClick={console.log}>
                                <FontAwesomeIcon icon={faTrashAlt} /> Delete
                            </Button>
                        </React.Fragment>
                    ) : null}
                </h3>
                {this.props.isLoading ? <h3>Loading...</h3> : null}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Events);
