import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import * as fetch from 'isomorphic-fetch';
import { Field } from 'react-final-form';
import ReactTable from 'react-table';
import { TaskEditModal } from './TaskEditModal';

import 'react-table/react-table.css';

type Props = {};

type State = {
  submitted: boolean;
  tasks: any[];
  modalValues: any | null;
};

const required = (value: any) => (value ? undefined : 'Required');

function ValidationError(props: any) {
  const { meta } = props;
  if (!meta.error || !meta.touched) {
    return null;
  }
  return <Alert color="danger">{meta.error}</Alert>;
}

export class TasksForm extends React.Component<Props, State> {
  state: State = {
    submitted: false,
    tasks: [],
    modalValues: null,
  };

  async loadTasks() {
    const tasksResponse = await fetch(`/api/tasks`);
    if (!tasksResponse.ok) {
      return;
    }
    const tasksJson = await tasksResponse.json();
    this.setState({
      tasks: tasksJson.data,
    });
  }

  async componentDidMount() {
    await this.loadTasks();
  }

  stringFilter = (filter: any, row: any) => (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase());

  handleSubmit = async (values: any) => {
    const result = await fetch(`/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([values]),
    });

    if (!result.ok) {
      return;
    }

    this.setState({ submitted: true });
    await this.loadTasks();
    this.setState({ modalValues: null });
  };

  renderModal() {
    return (
      <TaskEditModal
        onApply={this.handleSubmit}
        onClose={() => {
          this.setState({ modalValues: null });
        }}
        isOpen={this.state.modalValues != null}
        initialValues={{
          verification: 'auto',
          ...this.state.modalValues,
        }}
      >
        <FormGroup className="col-md-auto">
          <Field name="name" validate={required}>
            {({ input, meta }) => (
              <>
                <Label>Task Name</Label>
                <Input {...input} name="name" type="text" />
                <ValidationError meta={meta} />
              </>
            )}
          </Field>
          <Field name="description">
            {({ input }) => (
              <>
                <Label>Description</Label>
                <Input {...input} name="description" type="textarea" />
              </>
            )}
          </Field>
        </FormGroup>
        <FormGroup className="col-md-auto">
          <Field name="descriptionUrl">
            {({ input }) => (
              <>
                <Label>Description Url</Label>
                <Input {...input} name="descriptionUrl" type="text" />
              </>
            )}
          </Field>
          <Field name="verification">
            {({ input, meta }) => (
              <>
                <Label>Verification</Label>
                <Input {...input} name="descriptionUrl" type="select">
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                </Input>
                <ValidationError meta={meta} />
              </>
            )}
          </Field>
        </FormGroup>
      </TaskEditModal>
    );
  }

  handleRowClick(row: any) {
    this.setState({
      modalValues: row.original,
    });
  }

  handleAddTaskClick = () => {
    this.setState({
      modalValues: {},
    });
  };

  render() {
    return (
      <div className="m-3">
        {this.renderModal()}
        <Button color="success" onClick={this.handleAddTaskClick}>
          Add
        </Button>
        <ReactTable
          className="-striped -highlight"
          defaultSorted={[{ id: 'id', desc: true }]}
          filterable={true}
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          data={this.state.tasks}
          columns={[
            {
              Header: 'Task Id',
              accessor: 'id',
              maxWidth: 100,
              sortMethod: (a, b) => b - a,
            },
            {
              Header: 'Name',
              accessor: 'name',
              maxWidth: 300,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Description',
              accessor: 'description',
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Description Url',
              accessor: 'descriptionUrl',
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Verification',
              accessor: 'verification',
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Actions',
              filterable: false,
              maxWidth: 200,
              Cell: row => (
                <>
                  <Button color="link" onClick={() => this.handleRowClick(row)}>
                    Edit
                  </Button>
                </>
              ),
            },
          ]}
        />
      </div>
    );
  }
}
