import * as React from 'react';
import { FormGroup, Label, Button, Input, Alert } from 'reactstrap';
import { Form, Field, SubsetFormApi, FormRenderProps } from 'react-final-form';
import AsyncSelect from 'react-select/lib/Async';
import { components } from 'react-select';
import Header from '../components/Header';
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
    success: boolean;
  } | null;
  isLoading: boolean;
};

const required = (value: any) => (value ? undefined : 'Required');

const formatDisplayValue = (data: User) => {
  let result = data.githubId;
  if (data.firstName || data.lastName) {
    result = `${result} (${data.firstName} ${data.lastName})`;
  }
  return result;
};

const Option = (props: any) => {
  const data: User = props.data;
  return (
    <components.Option {...props} key={data.githubId}>
      {formatDisplayValue(data)}
    </components.Option>
  );
};

const SingleValue = (props: any) => {
  const data: User = props.data;
  return (
    <components.SingleValue {...props} value={data.githubId}>
      {formatDisplayValue(data)}
    </components.SingleValue>
  );
};

const badges = [
  { id: 'Awesome_team', name: 'Awesome team' },
  { id: 'Congratulations', name: 'Congratulations' },
  { id: 'Contribution_to_the_community', name: 'Contribution to the Community' },
  { id: 'Expert_help', name: 'Expert help' },
  { id: 'Good_job', name: 'Good job' },
  { id: 'Great_speaker', name: 'Great speaker' },
  { id: 'Helping_hand', name: 'Helping hand' },
  { id: 'Hero', name: 'Hero' },
  { id: 'Hight_mark', name: 'Hight mark' },
  { id: 'Real_magician', name: 'Real magician' },
  { id: 'Silent_hero', name: 'Silent hero' },
  { id: 'Super_hero', name: 'Super hero' },
  { id: 'Team_player', name: 'Team player' },
  { id: 'Thank_you', name: 'Thank you' },
  { id: 'You_are_amazing', name: 'You are amazing!' },
];

class FeedbackPage extends React.Component<Props, State> {
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
    return fetch(`/api/users/search/${searchText}`, { credentials: 'same-origin' })
      .then(result => (result.ok ? result.json() : { data: [] }))
      .then(response => {
        return response.data;
      });
  };

  private validateComment = (value: string) => {
    if (!value) {
      return undefined;
    }
    return value.length < 20 ? 'Comment should be at least 20 characters' : undefined;
  };

  private handleSubmit = async (values: any, form: SubsetFormApi) => {
    this.setState({ isLoading: true });
    const result = await fetch(`/api/course/${this.props.course.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toUserId: values.user.id,
        badgeId: values.badgeId,
        comment: values.comment,
      }),
      credentials: 'same-origin',
    });
    if (result.ok) {
      form.reset();
    }

    const submitStatus = result.ok
      ? { success: true, message: 'Feedback has been submitted' }
      : { success: false, message: 'An error occurred' };
    this.setState({
      isLoading: false,
      submitStatus,
    });

    this.timerRef = setTimeout(() => this.setState({ submitStatus: null }), 3000);
  };

  private renderForm = ({ handleSubmit }: FormRenderProps) => {
    return (
      <LoadingScreen show={this.state.isLoading}>
        <form onSubmit={handleSubmit}>
          <FormGroup className="col-md-6">
            <Field name="user" validate={required}>
              {({ meta, input }) => (
                <>
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
                </>
              )}
            </Field>
          </FormGroup>
          <FormGroup className="col-md-6">
            <Field name="badgeId">
              {({ input }) => (
                <>
                  <Label>Badge</Label>
                  <Input {...input} type="select" placeholder="Badge">
                    <option value="">(Empty)</option>
                    {this.state.badges.map(badge => (
                      <option value={badge.id} key={badge.id}>
                        {badge.name}
                      </option>
                    ))}
                  </Input>
                </>
              )}
            </Field>
          </FormGroup>
          <FormGroup className="col-md-6">
            <Field name="comment" validate={this.validateComment}>
              {({ input, meta }) => (
                <>
                  <Label>Comment</Label>
                  <Input {...input} name="comment" type="textarea" />
                  <ValidationError meta={meta} />
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
    );
  };

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
          <h3 className="mb-3">{this.props.course.name}: Leave Feedback</h3>
          {this.state.submitStatus && (
            <Alert color={this.state.submitStatus.success ? 'info' : 'danger'}>{this.state.submitStatus.message}</Alert>
          )}
          <Form onSubmit={this.handleSubmit} render={this.renderForm} />
        </div>
      </>
    );
  }
}

export default withCourseData(withSession(FeedbackPage));
