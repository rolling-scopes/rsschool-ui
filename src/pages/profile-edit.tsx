import axios from 'axios';
import Link from 'next/link';
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { withRouter } from 'next/router';

import { Button, FormGroup, Input, Label, Table } from 'reactstrap';
import Header from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import ValidationError from '../components/ValidationError';
import withSession, { Session } from '../components/withSession';
import '../index.scss';

type Props = {
  router: any;
  session: Session;
};

type State = {
  profile: any;
  isLoading: boolean;
};

const required = (value: any) => (value ? undefined : 'Required');

class EditProfilePage extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    profile: null,
  };

  constructor(props: Readonly<Props>) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    this.setState({ isLoading: true });

    try {
      const response = await axios.get(`api/profile/me`);

      const profile = response.data.data;
      this.setState({ isLoading: false, profile });
    } catch (e) {
      this.setState({ isLoading: false, profile: null });
    }
  }

  async componentDidMount() {
    await this.fetchData();
  }

  private handleSubmit = async (values: any) => {
    try {
      this.setState({ isLoading: true });
      const externalAccounts = [];
      if (values.codewars) {
        externalAccounts.push({
          service: 'codewars',
          username: values.codewars,
        });
      }
      if (values.codeacademy) {
        externalAccounts.push({
          service: 'codeacademy',
          username: values.codeacademy,
        });
      }
      if (values.htmlacademy) {
        externalAccounts.push({
          service: 'htmlacademy',
          username: values.htmlacademy,
        });
      }
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        firstNameNative: values.firstNameNative,
        lastNameNative: values.lastNameNative,
        externalAccounts,
      };

      const response = await axios.post(`api/profile/me`, data);
      const profile = response.data.data;

      this.setState({ isLoading: false, profile });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  private getInitialValues = (profile: any) => {
    const codewars = profile.externalAccounts.find((i: any) => i.service === 'codewars');
    const codeacademy = profile.externalAccounts.find((i: any) => i.service === 'codeacademy');
    const htmlacademy = profile.externalAccounts.find((i: any) => i.service === 'htmlacademy');
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      firstNameNative: profile.firstNameNative,
      lastNameNative: profile.lastNameNative,
      codewars: codewars ? codewars.username : '',
      codeacademy: codeacademy ? codeacademy.username : '',
      htmlacademy: htmlacademy ? htmlacademy.username : '',
    };
  };

  renderProfile() {
    if (!this.state.profile) {
      return (
        <div>
          <Header />
          <h2 className="m-4">No Access</h2>
        </div>
      );
    }
    const { profile } = this.state;

    return (
      <div>
        <Header />
        <div className="profile_container">
          <Form
            onSubmit={this.handleSubmit}
            initialValues={this.getInitialValues(profile)}
            render={({ handleSubmit }) => (
              <LoadingScreen show={this.state.isLoading}>
                <form onSubmit={handleSubmit}>
                  <FormGroup className="col-md-6">
                    <Field name="firstName" validate={required}>
                      {({ input, meta }) => (
                        <>
                          <Label>First Name</Label>
                          <Input {...input} name="lastName" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>
                  <FormGroup className="col-md-6">
                    <Field name="lastName" validate={required}>
                      {({ input, meta }) => (
                        <>
                          <Label>Last Name</Label>
                          <Input {...input} name="lastName" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>
                  <FormGroup className="col-md-6">
                    <Field name="firstNameNative" validate={required}>
                      {({ input, meta }) => (
                        <>
                          <Label>First Name Native</Label>
                          <Input {...input} name="firstNameNative" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>
                  <FormGroup className="col-md-6">
                    <Field name="lastNameNative" validate={required}>
                      {({ input, meta }) => (
                        <>
                          <Label>Last Name Native</Label>
                          <Input {...input} name="lastNameNative" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>

                  <FormGroup className="col-md-6">
                    <Field name="codewars">
                      {({ input, meta }) => (
                        <>
                          <Label>Codewars Username</Label>
                          <Input {...input} name="codewars" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>

                  <FormGroup className="col-md-6">
                    <Field name="htmlacademy">
                      {({ input, meta }) => (
                        <>
                          <Label>HTML Academy Username</Label>
                          <Input {...input} name="htmlacademy" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>

                  <FormGroup className="col-md-6">
                    <Field name="сodeacademy">
                      {({ input, meta }) => (
                        <>
                          <Label>Codeacademy Username</Label>
                          <Input {...input} name="сodeacademy" type="text" />
                          <ValidationError meta={meta} />
                        </>
                      )}
                    </Field>
                  </FormGroup>

                  <div className="row text-center">
                    <div className="form-group col-md-6 d-flex justify-content-between">
                      <Button
                        onClick={() => {
                          this.props.router.push('/profile');
                        }}
                        color="secondary"
                      >
                        Back to Profile
                      </Button>
                      <Button type="submit" color="success">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </LoadingScreen>
            )}
          />
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.session) {
      return null;
    }
    return (
      <>
        <LoadingScreen show={this.state.isLoading}>{this.renderProfile()}</LoadingScreen>
      </>
    );
  }

  private renderGeneralInfo(profile: any) {
    return (
      <>
        <div className="profile_header">General Information</div>
        <div className="profile_section">
          <div className="profile_value profile-avatar-action">
            <img width="64" src={`https://github.com/${profile.githubId}.png`} />
            <div className="spacer" />
            <Button color="primary" className="profile-action-edit">
              Edit
            </Button>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Name and Surname</div>
          <div className="profile_value">
            {profile.firstNameNative} {profile.lastNameNative}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Name and Surname as in passport</div>
          <div className="profile_value">
            {profile.firstName} {profile.lastName}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Location</div>
          <div className="profile_value">{profile.locationName}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Github</div>
          <div className="profile_value">
            <a href={`https://github.com/${profile.githubId}`}>{`https://github.com/${profile.githubId}`}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Contacts</div>
          <div className="profile_value">
            <a href={`tel:${profile.contactsPhone}`}>{profile.contactsPhone}</a>
            <br />
            <a href={`mailto:${profile.contactsEmail}`}>{profile.contactsEmail}</a>
            <a href={`mailto:${profile.contactsEpamEmail}`}>{profile.contactsEpamEmail}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Education</div>
          <div className="profile_value">
            {profile.educationHistory
              .filter((edh: any) => edh.university || edh.faculty)
              .map((edh: any, i: number) => (
                <div key={i}>
                  <div>Graduation Year: {edh.graduationYear}</div>
                  <div>University: {edh.university}</div>
                  <div>Faculty: {edh.faculty}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Employment history</div>
          <div className="profile_value">{profile.employmentHistory.join(', ')}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Estimated english level</div>
          <div className="profile_value">{profile.englishLevel ? profile.englishLevel.toUpperCase() : null}</div>
        </div>
        <div className="profile_section">
          <div className="profile_label">CV</div>
          <div className="profile_value">
            <a href={`${profile.cvUrl}`}>{profile.cvUrl}</a>
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">External accounts</div>
          <div className="profile_value">
            {profile.externalAccounts
              .filter((exta: any) => exta.username)
              .map((exta: any) => `Service: ${exta.service} Name: ${exta.username}`)}
          </div>
        </div>
        <div className="profile_section">
          <div className="profile_label">Fulltime ready</div>
          <div className="profile_value">{profile.readyFullTime}</div>
        </div>
      </>
    );
  }

  private renderStudentProfile(profile: any) {
    if (!profile.students || profile.students.length === 0) {
      return (
        <>
          <div className="profile_header">Student Profile</div>
          <div className="profile_section">No Data</div>
        </>
      );
    }
    return (
      <>
        <div className="profile_header">Student Profile</div>
        {profile.students.map((student: any, i: number) => {
          const mentor = student.mentor;
          const mentorUser = mentor.user;
          const tasks = student.taskResults;
          const feedback = student.feedback;
          return (
            <div key={i}>
              <div className="profile_subheader">{student.course.name}</div>
              <div className="profile_section">
                <div className="profile_label">Mentor</div>
                <div className="profile_value">
                  <span key={mentorUser.githubId}>
                    <Link
                      key={mentorUser.githubId}
                      href={{ pathname: '/profile', query: { githubId: mentorUser.githubId } }}
                    >
                      <a>
                        {mentorUser.firstName} {mentorUser.lastName}
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
              {tasks.length > 0 && (
                <div className="profile_section">
                  <Table className="profile-task-table mt-3">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Score</th>
                        <th>PR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks
                        .sort((a: any, b: any) =>
                          a.studentEndDate ? a.studentEndDate.localeCompare(b.studentEndDate) : -1,
                        )
                        .map((t: any, i: any) => {
                          return (
                            <tr key={i}>
                              <th>
                                {t.task.descriptionUrl ? (
                                  <a href={t.task.descriptionUrl}>{t.task.name}</a>
                                ) : (
                                  t.task.name
                                )}
                              </th>
                              <td>{t.score}</td>
                              <td>{t.githubPrUrl ? <a href={t.githubPrUrl}>{t.githubPrUrl}</a> : t.githubPrUrl}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              )}
              {(feedback as { comment: string }[]).map((f, i) => (
                <div key={i}>
                  <div className="profile_section">
                    <div className="profile_label">Comment </div>
                    <div className="profile_value">{f.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  }

  private renderBadges(profile: any) {
    const receivedFeedback: {
      fromUser: number;
      toUser: number;
      comment: string;
      badgeId: string;
    }[] = profile.receivedFeedback;

    if (receivedFeedback.length === 0) {
      return (
        <>
          <div className="profile_header">#gratitude</div>
          <div className="profile_section">No Data</div>
        </>
      );
    }
    return (
      <>
        <div className="profile_header">#gratitude</div>
        {receivedFeedback.map((feedback, i) => (
          <div key={i}>
            <div className="profile_section">
              <div className="profile_label">Comment</div>
              <div className="profile_value">
                {feedback.comment} ({feedback.badgeId})
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(withSession(EditProfilePage));
