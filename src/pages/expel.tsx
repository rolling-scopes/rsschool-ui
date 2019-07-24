import * as React from 'react';
import { Field, Form, SubsetFormApi } from 'react-final-form';
import Select from 'react-select';
import axios from 'axios';

import { Alert, Button, FormGroup, Input, Label } from 'reactstrap';
import Header from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { Option, SingleValue } from '../components/UserSelect';
import ValidationError from '../components/ValidationError';
import withCourseData, { Course } from '../components/withCourseData';
import withSession, { Session } from '../components/withSession';
import '../index.scss';

type Student = { firstName: string; lastName: string; studentId: number; isExpelled: boolean };

type Props = {
  session?: Session;
  course: Course;
};

type State = {
  students: Student[];
  submitted: boolean;
  resultMessage: string | undefined;
  isLoading: boolean;
};

const required = (value: any) => (value ? undefined : 'Required');

class ExpelPage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    students: [],
    submitted: false,
    resultMessage: undefined,
  };
  formRef = React.createRef();

  async componentDidMount() {
    const studentsResponse = await axios.get<{ data: { students: Student[] } }>(
      `/api/course/${this.props.course.id}/mentor/students`,
    );
    const students = studentsResponse.data.data.students.filter(student => !student.isExpelled);
    this.setState({ students });
  }

  handleSubmit = async (values: any, form: SubsetFormApi) => {
    this.setState({ isLoading: true });

    try {
      await axios.post(`/api/course/${this.props.course.id}/expulsion`, values);
      this.setState({
        isLoading: false,
        submitted: true,
        resultMessage: 'The student has been expelled',
      });
      form.reset();
    } catch (e) {
      this.setState({
        isLoading: false,
        resultMessage: 'An error occurred',
      });
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
            <h3 className="mb-3">
              <Alert color="danger">Expel student from {this.props.course.name}</Alert>
            </h3>
            {this.state.submitted && <Alert color="info">{this.state.resultMessage}</Alert>}
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

export default withCourseData(withSession(ExpelPage));
