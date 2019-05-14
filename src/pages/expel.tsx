import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import { Form, Field, SubsetFormApi } from 'react-final-form';
import Header from '../components/Header';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { LoadingScreen } from '../components/LoadingScreen';
import ValidationError from '../components/ValidationError';

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
    const studentsResponse = await fetch(`/api/course/${this.props.course.id}/mentor/students`, {
      credentials: 'same-origin',
    });

    let students = [];

    if (studentsResponse.ok) {
      students = (await studentsResponse.json()).data.students;
    }
    this.setState({ students });
  }

  handleSubmit = async (values: any, form: SubsetFormApi) => {
    this.setState({
      isLoading: true,
    });
    const result = await fetch(`/api/course/${this.props.course.id}/expulsion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'same-origin',
    });
    if (result.ok) {
      this.setState({
        isLoading: false,
        submitted: true,
        resultMessage: 'The student has been expelled',
      });
      form.reset();
      return;
    }
    this.setState({
      isLoading: false,
      resultMessage: 'An error occurred',
    });
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
                            <Input {...input} type="select" placeholder="Student">
                              <option value="">(Empty)</option>
                              {this.state.students.map((student, i) => (
                                <option disabled={!!student.isExpelled} value={student.studentId} key={i}>
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
