import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import axios from 'axios';
import { Form, Field, SubsetFormApi } from 'react-final-form';
// @ts-ignore
import AsyncSelect from 'react-select/async';
import { SingleValue, Option } from '../components/UserSelect';
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

  loadStudents = async (searchText: string) => {
    if (!searchText) {
      return this.state.students.slice(0, 10);
    }
    return this.state.students
      .filter(student => {
        return student.githubId.startsWith(searchText.toLowerCase());
      })
      .slice(0, 10);
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
                          <AsyncSelect
                            placeholder={'(Choose Student)'}
                            isSearchable={true}
                            cacheOptions={true}
                            getOptionValue={(student: Student) => student.githubId}
                            components={{ Option, SingleValue }}
                            noOptionsMessage={() => 'Start typing...'}
                            loadOptions={this.loadStudents}
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
