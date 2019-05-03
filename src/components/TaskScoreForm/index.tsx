import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import * as fetch from 'isomorphic-fetch';
import { Form, Field } from 'react-final-form';
import { Course } from '../withCourseData';

import './index.scss';

type Props = {
  course: Course;
};

type State = {
  students: { firstName: string; lastName: string; studentId: number }[];
  tasks: any[];
  mentorData?: { students: any[] };

  submitted: boolean;
};

const githubPrRegExp = /https:\/\/github.com\/(\w|\d|\-)+\/(\w|\d|\-)+\/pull\/(\d)+/gi;

const required = (value: any) => (value ? undefined : 'Required');

const isGithubPr = (value: string) => {
  if (!value) {
    return 'Required';
  }
  if (!value.match(githubPrRegExp)) {
    return 'URL is not Github Pull Request';
  }
  return undefined;
};

function ValidationError(props: any) {
  const { meta } = props;
  if (!meta.error || !meta.touched) {
    return null;
  }
  return <Alert color="danger">{meta.error}</Alert>;
}

class TaskScoreForm extends React.Component<Props, State> {
  state: State = {
    students: [],
    tasks: [],
    mentorData: undefined,
    submitted: false,
  };

  async componentDidMount() {
    const [meResponse, tasksResponse] = await Promise.all([
      fetch(`/api/course/${this.props.course.id}/mentor/students`, {
        credentials: 'same-origin',
      }),
      fetch(`/api/course/${this.props.course.id}/tasks`, {
        credentials: 'same-origin',
      }),
    ]);

    if (!meResponse.ok || !tasksResponse.ok) {
      return;
    }

    const [json, tasksJson] = await Promise.all([meResponse.json(), tasksResponse.json()]);

    this.setState({
      students: json.data.students,
      tasks: tasksJson.data,
    });
  }

  handleSubmit = async (values: any) => {
    const result = await fetch(`/api/course/${this.props.course.id}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'same-origin',
    });
    if (result.ok) {
      this.setState({
        submitted: true,
      });
    }
  };

  render() {
    return (
      <div className="m-3">
        <h3 className="mb-3">{this.props.course.name}</h3>
        {this.state.submitted && <Alert color="info">Score has been submitted</Alert>}
        <Form
          onSubmit={this.handleSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FormGroup className="col-md-6">
                <Field name="studentId" validate={required}>
                  {({ input, meta }) => (
                    <>
                      <Label>Student</Label>
                      <Input {...input} type="select" placeholder="Student">
                        <option value="">(Empty)</option>
                        {this.state.students.map((student, i) => (
                          <option value={student.studentId} key={i}>
                            {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </Input>
                      <ValidationError meta={meta} />
                    </>
                  )}
                </Field>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Field name="courseTaskId">
                  {({ input, meta }) => (
                    <>
                      <Label>Task</Label>
                      <Input {...input} name="tasks" type="select">
                        <option value="">(Empty)</option>
                        {this.state.tasks.map((task, i) => (
                          <option value={task.courseTaskId} key={i}>
                            {task.name}
                          </option>
                        ))}
                      </Input>
                      <ValidationError meta={meta} />
                    </>
                  )}
                </Field>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Field name="githubPrUrl" validate={isGithubPr}>
                  {({ input, meta }) => (
                    <>
                      <Label>Github PR</Label>
                      <Input {...input} placeholder="https://github.com/...." name="github-pr" type="text" />
                      <ValidationError meta={meta} />{' '}
                    </>
                  )}
                </Field>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Field name="score" validate={required}>
                  {({ input, meta }) => (
                    <>
                      <Label>Score</Label>
                      <Input {...input} name="score" type="number" />
                      <ValidationError meta={meta} />{' '}
                    </>
                  )}
                </Field>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Field name="comment" validate={required}>
                  {({ input, meta }) => (
                    <>
                      <Label>Comment</Label>
                      <Input {...input} name="comment" type="textarea" />
                      <ValidationError meta={meta} />{' '}
                    </>
                  )}
                </Field>
              </FormGroup>
              <div className="row text-center">
                <div className="form-group col-md-6">
                  <Button type="submit" color="success">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

export default TaskScoreForm;
