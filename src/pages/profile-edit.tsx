import axios from 'axios';
import { withRouter } from 'next/router';
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, FormGroup, Input, Label } from 'reactstrap';
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
}

export default withRouter(withSession(EditProfilePage));
