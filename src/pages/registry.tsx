import * as React from 'react';

import { Button, ButtonGroup, FormGroup, Input, Label } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import Select from 'react-select';

import Header from '../components/Header';
import ValidationError from '../components/ValidationError';

import { Course } from '../components/withCourseData';
import withCourses from '../components/withCourses';
import withSession, { Session } from '../components/withSession';

import { City, CITIES } from './../services/reference-data';

const TYPES = {
  MENTOR: 'mentor',
  MENTEE: 'mentee',
};

const required = (value: any) => (value ? undefined : 'Required');

type Props = {
  courses?: Course[];
  session?: Session;
};

type SelectCourse = {
  label?: string,
  value?: number,
};

type State = {
  selectedCourse: SelectCourse,
  courses: SelectCourse[],
  type: string,
};

// type FormModel = {
//   firstName: string,
//   lastName: string,
//   nativeFirstName?: string,
//   nativeLastName?: string,
//   dateOfBirth?: Date,
//   locationName: City,
//   otherLocationName?: string,
//   contactsPhone: string,
//   contactsEmail: string,
//   contactsEpamEmail?: string,
//   educationHistory?: string,
//   employmentHistory?: string,
//   comment?: string,
// }

class CourseRegistryPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const courses: SelectCourse[] = (this.props.courses || [])
      .filter((course: Course) => !course.completed)
      .map((course: Course): SelectCourse => ({ label: course.name, value: course.id }));

    this.state = {
      selectedCourse: courses[0],
      courses,
      type: TYPES.MENTEE,
    }
  }

  private changeType = (event: React.MouseEvent) => {
    const id = (event.target as Element).id;
    this.setState({ type: id });
  }

  private changeCourse = (course: any) => {
    this.setState({ selectedCourse: course });
  }

  private getButtonClass = (buttonId: string) => this.state.type === buttonId ? 'success' : 'secondary'

  private handleSubmit = (model: any) => {
    console.dir(model);
  }

  render() {
    if (!this.props.session) {
      return null;
    }

    const { selectedCourse, courses, type } = this.state

    return (
      <div>
        <Header username={this.props.session.githubId} />

        <div className="container">
          <FormGroup>
            <h3>Course Registry</h3>
          </FormGroup>
          <div className="row align-items-center">
            <FormGroup className="col-md-6">
              <ButtonGroup>
                <Button
                  id={TYPES.MENTEE}
                  color={this.getButtonClass(TYPES.MENTEE)}
                  onClick={this.changeType}
                  className="border border-success"
                >
                  Mentee
                </Button>
                <Button
                  id={TYPES.MENTOR}
                  color={this.getButtonClass(TYPES.MENTOR)}
                  onClick={this.changeType}
                  className="border border-success"
                >
                  Mentor
                </Button>
              </ButtonGroup>
            </FormGroup>
            <FormGroup className="col-md-6">
              <Select
                value={selectedCourse}
                options={courses}
                onChange={this.changeCourse}
              />
            </FormGroup>
          </div>

          <Form
            onSubmit={this.handleSubmit}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="row text-left">
                  <Field name="firstName" validate={required}>
                    {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>First Name</Label>
                          <Input {...input} name="firstName" type="text" />
                          <ValidationError meta={meta} />
                        </FormGroup>
                    )}
                  </Field>
                  <Field name="lastName" validate={required}>
                    {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Last Name</Label>
                          <Input {...input} name="lastName" type="text" />
                          <ValidationError meta={meta} />
                        </FormGroup>
                    )}
                  </Field>
                </div>
                {
                  type === TYPES.MENTEE &&
                  (<>
                    <div className="row text-left">
                      <Field name="nativeFirstName">
                        {({ input }) => (
                            <FormGroup className="col-md-6">
                              <Label>Native First Name</Label>
                              <Input {...input} name="nativeFirstName" type="text" />
                            </FormGroup>
                        )}
                      </Field>
                      <Field name="nativeLastName">
                        {({ input }) => (
                            <FormGroup className="col-md-6">
                              <Label>Native Last Name</Label>
                              <Input {...input} name="nativeLastName" type="text" />
                            </FormGroup>
                        )}
                      </Field>
                    </div>
                    <div className="row text-left">
                      <Field name="dateOfBirth">
                        {({ input }) => (
                            <FormGroup className="col-md-6">
                              <Label>Date Of Birth</Label>
                              <Input {...input} name="dateOfBirth" type="date" />
                              </FormGroup>
                        )}
                      </Field>
                    </div>
                  </>)
                }
                <div className="row text-left">
                  <Field name="locationName" validate={required}>
                    {({ input, meta }) => (
                      <FormGroup className="col-md-6">
                        <Label>Location Name</Label>
                        <Input {...input} type="select">
                          <option value="">(Empty)</option>
                          {CITIES.map((city, i) => (
                            <option value={city.id} key={i}>
                              {city.name}
                            </option>
                          ))}
                        </Input>
                        <ValidationError meta={meta} />
                      </FormGroup>
                    )}
                  </Field>
                  <Field name="otherLocationName">
                    {({ input }) => (
                      <FormGroup className="col-md-6">
                        <Label>Location Name (If Other)</Label>
                        <Input {...input} name="otherLocationName" type="text" />
                      </FormGroup>
                    )}
                  </Field>
                </div>
                <div className="row text-left">
                  <Field name="contactsPhone" validate={required}>
                    {({ input, meta }) => (
                      <FormGroup className="col-md-6">
                        <Label>Contacts Phone</Label>
                        <Input {...input} name="contactsPhone" type="tel" />
                        <ValidationError meta={meta} />
                      </FormGroup>
                    )}
                  </Field>
                  <Field name="contactsEmail" validate={required}>
                    {({ input, meta }) => (
                      <FormGroup className="col-md-6">
                        <Label>Contacts E-mail</Label>
                        <Input {...input} name="contactsEmail" type="email" />
                        <ValidationError meta={meta} />
                      </FormGroup>
                    )}
                  </Field>
                </div>
                <div className="row text-left">
                  <Field name="contactsEpamEmail">
                    {({ input }) => (
                      <FormGroup className="col-md-6">
                        <Label>Contacts EPAM E-mail</Label>
                        <Input {...input} name="contactsEpamEmail" type="email" />
                      </FormGroup>
                    )}
                  </Field>
                </div>
                <div className="row text-left">
                  {
                    type === TYPES.MENTEE &&
                    (<Field name="educationHistory" validate={required}>
                      {({ input, meta }) => (
                        <FormGroup className="col-md-6">
                          <Label>Education History</Label>
                          <Input {...input} name="educationHistory" type="text" />
                          <ValidationError meta={meta} />
                        </FormGroup>
                      )}
                    </Field>)
                  }
                  <Field
                    name="employmentHistory"
                    validate={(value: any) => (value || type === TYPES.MENTEE ? undefined : 'Required')}
                  >
                    {({ input, meta }) => (
                      <FormGroup className="col-md-6">
                        <Label>Employment History</Label>
                        <Input {...input} name="employmentHistory" type="text" />
                        <ValidationError meta={meta} />
                      </FormGroup>
                    )}
                  </Field>
                </div>
                <div className="row text-left">
                  <Field name="comment">
                    {({ input }) => (
                      <FormGroup className="col-md-6">
                        <Label>Comment</Label>
                        <Input {...input} name="comment" type="textarea" />
                      </FormGroup>
                    )}
                  </Field>
                </div>
                <div className="row text-left">
                  <FormGroup className="col-md-6">
                    <Button type="submit" color="success">Submit</Button>
                  </FormGroup>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    )
  }
}

export default withCourses(withSession(CourseRegistryPage));
