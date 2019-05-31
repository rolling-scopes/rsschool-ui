import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { Field } from 'react-final-form';
import ReactTable from 'react-table';
import { TaskEditModal } from './TaskEditModal';

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
    const tasksResponse = await axios.get(`/api/tasks`);
    this.setState({ tasks: tasksResponse.data.data });
  }

  async componentDidMount() {
    await this.loadTasks();
  }

  stringFilter = (filter: any, row: any) => (row[filter.id] || '').toLowerCase().startsWith(filter.value.toLowerCase());

  handleSubmit = async (values: any) => {
    await axios.post(`/api/tasks`, [values]);
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
        <Field name="name" validate={required}>
          {({ input, meta }) => (
            <FormGroup className="col-md-auto">
              <Label>Task Name</Label>
              <Input {...input} name="name" type="text" />
              <ValidationError meta={meta} />
            </FormGroup>
          )}
        </Field>
        <Field name="description">
          {({ input }) => (
            <FormGroup className="col-md-auto">
              <Label>Description</Label>
              <Input {...input} name="description" type="textarea" />
            </FormGroup>
          )}
        </Field>

        <Field name="descriptionUrl">
          {({ input }) => (
            <FormGroup className="col-md-auto">
              <Label>Description Url</Label>
              <Input {...input} name="descriptionUrl" type="text" />
            </FormGroup>
          )}
        </Field>

        <Field name="verification">
          {({ input, meta }) => (
            <FormGroup className="col-md-auto">
              <Label>Verification</Label>
              <Input {...input} name="descriptionUrl" type="select">
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
                <option value="interview">Interview</option>
              </Input>
              <ValidationError meta={meta} />
            </FormGroup>
          )}
        </Field>

        <Field name="allowStudentArtefacts" type="checkbox">
          {({ input, meta }) => (
            <FormGroup className="col-md-auto">
              <Label>
                <Input {...input} name="allowStudentArtefacts" type="checkbox" />
                Allow Student Artefacts
              </Label>
              <ValidationError meta={meta} />
            </FormGroup>
          )}
        </Field>
      </TaskEditModal>
    );
  }

  handleRowClick(row: any) {
    this.setState({ modalValues: row.original });
  }

  handleAddTaskClick = () => {
    this.setState({ modalValues: {} });
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
          defaultSorted={[{ id: 'name', desc: false }]}
          filterable={true}
          defaultPageSize={50}
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
              maxWidth: 360,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Description',
              accessor: 'description',
              maxWidth: 100,
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
              maxWidth: 100,
              filterMethod: this.stringFilter,
            },
            {
              Header: 'Actions',
              filterable: false,
              maxWidth: 100,
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
