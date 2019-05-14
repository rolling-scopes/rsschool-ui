import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import * as fetch from 'isomorphic-fetch';
import { Form, Field, SubsetFormApi } from 'react-final-form';
import { sortTasksByEndDate } from '../../services/rules';
import { Course } from '../withCourseData';
import ValidationError from '../ValidationError';
import { LoadingScreen } from '../LoadingScreen';

import './index.scss';

type Student = { firstName: string; lastName: string; studentId: number; isExpelled: boolean };

type Props = {
  course: Course;
};

type State = {
  students: Student[];
  tasks: any[];
  isLoading: boolean;
  submitted: boolean;
};

const githubPrRegExp = /https:\/\/github.com\/(\w|\d|\-)+\/(\w|\d|\-)+\/pull\/(\d)+/gi;

const required = (value: any) => (value ? undefined : 'Required');

class TaskScoreForm extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    tasks: [],
    submitted: false,
  };

  validateGithubPr = (value: string, allValues: any) => {
    if (!allValues.courseTaskId) {
      return;
    }
    const courseTaskId = Number(allValues.courseTaskId);
    const task = this.state.tasks.find(task => task.courseTaskId === courseTaskId);
    if (task == null || !task.githubPrRequired) {
      return;
    }
    if (!value) {
      return 'Required';
    }
    if (!value.match(githubPrRegExp)) {
      return 'URL is not Github Pull Request';
    }
    return;
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

    let students = [];
    let tasks = [];

    if (meResponse.ok) {
      students = (await meResponse.json()).data.students;
    }
    if (tasksResponse.ok) {
      tasks = (await tasksResponse.json()).data.sort(sortTasksByEndDate).filter((task: any) => task.studentEndDate);
    }
    this.setState({ students, tasks });
  }

  handleSubmit = async (values: any, formApi: SubsetFormApi) => {
    this.setState({ isLoading: true });

    const result = await fetch(`/api/course/${this.props.course.id}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'same-origin',
    });

    if (result.ok) {
      formApi.reset();
    }
    this.setState({
      submitted: !!result.ok,
      isLoading: false,
    });
  };

  render() {
    return (
      <div className="m-3">
        <h3 className="mb-3">{this.props.course.name}</h3>
        {this.state.submitted && <Alert color="info">Score has been submitted</Alert>}
        <Form
          onSubmit={this.handleSubmit}
          render={({ handleSubmit }) => (
            <LoadingScreen show={this.state.isLoading}>
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
                              {student.isExpelled ? '(EXPELLED) ' : ''} {student.firstName} {student.lastName}
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
                  <Field name="githubPrUrl" validate={this.validateGithubPr}>
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
                  <Field name="comment">
                    {({ input }) => (
                      <>
                        <Label>Comment</Label>
                        <Input {...input} name="comment" type="textarea" />
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
            </LoadingScreen>
          )}
        />
      </div>
    );
  }
}

export default TaskScoreForm;
