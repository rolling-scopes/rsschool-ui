import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import { Form, Field, SubsetFormApi, FormRenderProps } from 'react-final-form';
// @ts-ignore
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import Header from '../components/Header';
import { SingleValue, Option } from '../components/UserSelect';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { LoadingScreen } from '../components/LoadingScreen';
import ValidationError from '../components/ValidationError';

import '../index.scss';

type Props = {
  session?: Session;
  course: Course;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  githubId: string;
};

type Badge = {
  id: string;
  name: string;
};

type State = {
  badges: Badge[];
  submitStatus: {
    message: string;
    heroesUrl?: string;
    success: boolean;
  } | null;
  isLoading: boolean;
};

const required = (value: any) => (value ? undefined : 'Required');

const badges = [
  { id: 'Congratulations', name: 'Congratulations' },
  { id: 'Expert_help', name: 'Expert help' },
  { id: 'Great_speaker', name: 'Great speaker' },
  { id: 'Good_job', name: 'Good job' },
  { id: 'Helping_hand', name: 'Helping hand' },
  { id: 'Hero', name: 'Hero' },
  { id: 'Thank_you', name: 'Thank you' },
];

class GratitudePage extends React.Component<Props, State> {
  state: State = {
    badges,
    isLoading: false,
    submitStatus: null,
  };

  private timerRef: any;

  private loadUsers = async (searchText: any) => {
    if (!searchText) {
      return [];
    }
    return axios
      .get(`/api/users/search/${searchText}`)
      .then(response => {
        return response.data.data;
      })
      .catch(() => []);
  };

  private validateComment = (value: string | undefined, allValues: any) => {
    if (!value && allValues.badgeId) {
      return undefined;
    }
    return !value || (value.length < 20 ? 'Comment should be at least 20 characters' : undefined);
  };

  private handleSubmit = async (values: any, form: SubsetFormApi) => {
    this.setState({ isLoading: true });
    try {
      const result = await axios.post(`/api/course/${this.props.course.id}/feedback`, {
        toUserId: values.user.id,
        badgeId: values.badgeId,
        comment: values.comment,
      });
      form.reset();
      const submitStatus = {
        success: true,
        heroesUrl: result.data.data.heroesUrl,
        message: `Your feedback has been submitted.`,
      };
      this.setState({ isLoading: false, submitStatus });
      this.timerRef = setTimeout(() => this.setState({ submitStatus: null }), 5000);
    } catch (e) {
      this.setState({ isLoading: false, submitStatus: { success: false, message: 'An error occurred' } });
    }
  };

  private renderForm = ({ handleSubmit }: FormRenderProps) => {
    return (
      <LoadingScreen show={this.state.isLoading}>
        <form onSubmit={handleSubmit}>
          <Field name="user" validate={required}>
            {({ meta, input }) => (
              <FormGroup className="col-md-6">
                <Label>User</Label>
                <AsyncSelect
                  placeholder={'Github ID'}
                  noOptionsMessage={() => 'Start typing...'}
                  getOptionValue={(user: User) => user.githubId}
                  components={{ Option, SingleValue }}
                  cacheOptions={true}
                  loadOptions={this.loadUsers}
                  onChange={(value: any) => input.onChange(value)}
                />
                <ValidationError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="badgeId">
            {({ input }) => (
              <FormGroup className="col-md-6">
                <Label>Badge</Label>
                <Input {...input} type="select" placeholder="Badge">
                  <option value="">(Empty)</option>
                  {this.state.badges.map(badge => (
                    <option value={badge.id} key={badge.id}>
                      {badge.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            )}
          </Field>
          <Field name="comment" validate={this.validateComment}>
            {({ input, meta }) => (
              <FormGroup className="col-md-6">
                <Label>Comment</Label>
                <Input {...input} name="comment" type="textarea" />
                <ValidationError meta={meta} />
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
    );
  };

  renderSubmitStatus() {
    if (!this.state.submitStatus) {
      return null;
    }
    return (
      <>
        <Alert color={this.state.submitStatus.success ? 'info' : 'danger'}>
          {this.state.submitStatus.message}
          <div>
            {this.state.submitStatus.heroesUrl && (
              <a href={this.state.submitStatus.heroesUrl}>{this.state.submitStatus.heroesUrl}</a>
            )}
          </div>
        </Alert>
      </>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerRef);
  }

  render() {
    if (!this.props.session || !this.props.course) {
      return null;
    }

    return (
      <>
        <Header username={this.props.session.githubId} />
        <div className="m-3">
          <h3 className="mb-3">#gratitude</h3>
          {this.renderSubmitStatus()}
          <Form onSubmit={this.handleSubmit} render={this.renderForm} />
        </div>
      </>
    );
  }
}

export default withCourseData(withSession(GratitudePage));
