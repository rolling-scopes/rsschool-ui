import axios from 'axios';
import * as React from 'react';
import { Field, Form, SubsetFormApi } from 'react-final-form';
import Select from 'react-select';
import { Alert, Button, FormGroup, Input, Label } from 'reactstrap';
import Header from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { Option, SingleValue } from '../components/UserSelect';
import ValidationError from '../components/ValidationError';
import withCourseData, { Course } from '../components/withCourseData';
import withSession, { Session } from '../components/withSession';
import { sortTasksByEndDate } from '../services/rules';

import '../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

type Student = { firstName: string; lastName: string; studentId: number; isExpelled: boolean };

type Task = {
  courseTaskId: number;
  taskId: number;
  name: string;
  maxScore: number | null;
  scoreWeight: number;
  stageId: number;
  githubPrRequired: boolean;
  verification: 'manual' | 'auto';
  description: string | null;
  descriptionUrl: string;
  studentStartDate: string | null;
  studentEndDate: string | null;
  taskResultCount: number;
  allowStudentArtefacts: boolean;
  useJury: boolean;
};

type State = {
  students: Student[];
  tasks: any[];
  isLoading: boolean;
  submitted: boolean;
};

const githubPrRegExp = /https:\/\/github.com\/(\w|\d|\-)+\/(\w|\d|\-)+\/pull\/(\d)+/gi;

const required = (value: any) => (value ? undefined : 'Required');

class TaskScorePage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    tasks: [],
    submitted: false,
  };

  private validateGithubPr = (value: string, allValues: any) => {
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
    const [studentsResponse, tasksResponse] = await Promise.all([
      axios.get<{ data: { students: Student[] } }>(`/api/course/${this.props.course.id}/mentor/students`),
      axios.get<{ data: Task[] }>(`/api/course/${this.props.course.id}/tasks`),
    ]);

    const students = studentsResponse.data.data.students.filter(student => !student.isExpelled);
    const tasks = tasksResponse.data.data
      .sort(sortTasksByEndDate)
      .filter(task => task.studentEndDate && task.verification !== 'auto' && !task.useJury);

    this.setState({ students, tasks });
  }

  handleSubmit = async (values: any, formApi: SubsetFormApi) => {
    this.setState({ isLoading: true });
    try {
      await axios.post(`/api/course/${this.props.course.id}/score`, values);

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
    const { roles, isAdmin } = this.props.session;
    if (roles[this.props.course.id] !== 'mentor' && !isAdmin) {
      return `You are not mentor in ${this.props.course.alias}`;
    }

    return (
      <>
        <div>
          <Header username={this.props.session.githubId} />
          <div className="m-3">
            <h3 className="mb-3">My Students</h3>

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
                            <Select
                              {...input}
                              onChange={(student: any) => input.onChange(student.studentId)}
                              value={this.state.students.find(student => student.studentId === input.value)}
                              placeholder={'Choose student'}
                              getOptionValue={(task: Student) => task.studentId.toString()}
                              components={{ Option, SingleValue }}
                              options={this.state.students}
                            />
                            {/* <Input {...input} type="select" placeholder="Student">
                              <option value="">(Empty)</option>
                              {this.state.students.map((student, i) => (
                                <option disabled={!!student.isExpelled} value={student.studentId} key={i}>
                                  {student.firstName} {student.lastName}
                                </option>
                              ))}
                            </Input> */}
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
        </div>
      </>
    );
  }
}

export default withCourseData(withSession(TaskScorePage));
