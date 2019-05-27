import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { Form, Field, SubsetFormApi } from 'react-final-form';
import Header from '../components/Header';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { sortTasksByEndDate } from '../services/rules';
import ValidationError from '../components/ValidationError';
import { LoadingScreen } from '../components/LoadingScreen';
import '../index.scss';

type Props = { session?: Session; course: Course };

type State = {
  studentId: number | null;
  tasks: any[];
  isLoading: boolean;
  submitted: boolean;
};

const urlRegExp = /((?:https?\:\/\/)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/gi;

class TaskScorePage extends React.Component<Props, State> {
  state: State = {
    studentId: null,
    isLoading: false,
    tasks: [],
    submitted: false,
  };

  private validateUrl = (value: string) => {
    if (!value || value.match(urlRegExp)) {
      return;
    }
    return 'Not valid URL';
  };

  private validateRequiredUrl = (value: string) => {
    if (!value) {
      return 'Required';
    }
    if (!value.match(urlRegExp)) {
      return 'Not valid URL';
    }
    return;
  };

  async componentDidMount() {
    const [tasksResponse, meResponse] = await Promise.all([
      axios.get(`/api/course/${this.props.course.id}/tasks`),
      axios.get(`/api/course/${this.props.course.id}/me`),
    ]);

    const tasks = tasksResponse.data.data.sort(sortTasksByEndDate).filter((task: any) => task.allowStudentArtefacts);
    this.setState({ tasks, studentId: meResponse.data.data.studentId || null });
  }

  handleSubmit = async (values: any, formApi: SubsetFormApi) => {
    this.setState({ isLoading: true });

    try {
      await axios.post(`/api/course/${this.props.course.id}/taskArtefact`, {
        ...values,
        studentId: this.state.studentId,
      });

      formApi.reset();
      this.setState({ submitted: true, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    if (!this.props.session || !this.props.session.roles || !this.props.course) {
      return null;
    }
    const { roles, isAdmin } = this.props.session;
    const isStudent = roles[this.props.course.id] === 'student' && this.state.studentId;
    if (!isStudent && !isAdmin) {
      return `You are not student in ${this.props.course.alias}`;
    }

    return (
      <>
        <div>
          <Header username={this.props.session.githubId} />
          <div className="m-3">
            <h3 className="mb-3">Submit Task Artefacts</h3>

            {this.state.submitted && <Alert color="info">Score has been submitted</Alert>}

            <Form
              onSubmit={this.handleSubmit}
              render={({ handleSubmit }) => (
                <LoadingScreen show={this.state.isLoading}>
                  <form onSubmit={handleSubmit}>
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
                    <Field name="videoUrl" validate={this.validateRequiredUrl}>
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Video Url</Label>
                          <Input {...input} placeholder="https://..." name="videoUrl" type="text" />
                          <ValidationError meta={meta} />
                        </FormGroup>
                      )}
                    </Field>
                    <Field name="presentationUrl" validate={this.validateUrl}>
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Presentation Url</Label>
                          <Input {...input} placeholder="https://..." name="presentationUrl" type="text" />
                          <ValidationError meta={meta} />
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

export default withCourseData(withSession(TaskScorePage));
