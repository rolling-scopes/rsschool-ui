import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { Form, Field, SubsetFormApi } from 'react-final-form';
import Select, { components } from 'react-select';
import Header from '../components/Header';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import ValidationError from '../components/ValidationError';
import { LoadingScreen } from '../components/LoadingScreen';
import '../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

type Student = {
  firstName: string;
  lastName: string;
  studentId: number;
  githubId: string;
};

type State = {
  students: Student[];
  tasks: any[];
  isLoading: boolean;
  submitted: boolean;
};

const required = (value: any) => (value ? undefined : 'Required');

const formatDisplayValue = (data: Student) => {
  let result = data.githubId;
  if (data.firstName || data.lastName) {
    result = `${result} (${data.firstName} ${data.lastName})`;
  }
  return result;
};

const GithubAvatar = (props: { githubId: string }) => (
  <img width="32" height="32" style={{ marginRight: '4px' }} src={`https://github.com/${props.githubId}.png`} />
);

const Option = (props: any) => {
  const data: Student = props.data;
  return (
    <components.Option {...props} key={data.githubId}>
      <GithubAvatar githubId={data.githubId} />
      {formatDisplayValue(data)}
    </components.Option>
  );
};

const SingleValue = (props: any) => {
  const data: Student = props.data;
  return (
    <components.SingleValue {...props} value={data.githubId}>
      <GithubAvatar githubId={data.githubId} />
      {formatDisplayValue(data)}
    </components.SingleValue>
  );
};

class TaskJuryScorePage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    tasks: [],
    submitted: false,
  };

  async componentDidMount() {
    const [studentsResponse, tasksResponse] = await Promise.all([
      axios.get(`/api/course/${this.props.course.id}/students`),
      axios.get(`/api/course/${this.props.course.id}/tasks`),
    ]);

    const students = studentsResponse.data.data;
    const tasks = tasksResponse.data.data.filter((task: any) => task.useJury);

    this.setState({ students, tasks });
  }

  handleSubmit = async (values: any, formApi: SubsetFormApi) => {
    try {
      this.setState({ isLoading: true });

      await axios.post(`/api/course/${this.props.course.id}/score`, {
        studentId: values.student.studentId,
        score: values.score,
        courseTaskId: values.courseTaskId,
        comment: values.comment,
      });
      formApi.reset();

      this.setState({ submitted: true, isLoading: false });
    } catch (e) {
      this.setState({ submitted: false, isLoading: false });
    }
  };

  render() {
    if (!this.props.session || !this.props.session.roles || !this.props.course) {
      return null;
    }
    const { isAdmin, isActivist } = this.props.session;
    if (!isActivist && !isAdmin) {
      return `You are not in jury (${this.props.course.alias})`;
    }

    return (
      <>
        <div>
          <Header username={this.props.session.githubId} />
          <div className="m-3">
            <h3 className="mb-3">{this.props.course.name}: Submit Jury Score</h3>
            {this.state.submitted && <Alert color="info">Score has been submitted</Alert>}

            <Form
              onSubmit={this.handleSubmit}
              render={({ handleSubmit }) => (
                <LoadingScreen show={this.state.isLoading}>
                  <form onSubmit={handleSubmit}>
                    <Field name="student" validate={required}>
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Student</Label>
                          <Select
                            placeholder={'(Choose Student)'}
                            isSearchable={true}
                            getOptionValue={(student: Student) => student.githubId}
                            components={{ Option, SingleValue }}
                            options={this.state.students}
                            onChange={(value: any) => input.onChange(value)}
                          />
                          <ValidationError meta={meta} />
                        </FormGroup>
                      )}
                    </Field>

                    <Field name="courseTaskId">
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
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
                        </FormGroup>
                      )}
                    </Field>

                    <Field name="score" validate={required}>
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Score</Label>
                          <Input {...input} name="score" type="number" />
                          <ValidationError meta={meta} />{' '}
                        </FormGroup>
                      )}
                    </Field>

                    <Field name="comment">
                      {({ input }) => (
                        <FormGroup className="col-md-6">
                          <Label>Comment</Label>
                          <Input {...input} name="comment" type="textarea" />
                        </FormGroup>
                      )}
                    </Field>

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
        </div>
      </>
    );
  }
}

export default withCourseData(withSession(TaskJuryScorePage));
