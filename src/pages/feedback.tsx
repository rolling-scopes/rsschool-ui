import * as React from 'react';
import Header from '../components/Header';
import { components } from 'react-select';
import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { LoadingScreen } from '../components/LoadingScreen';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { Button, Label, FormGroup, Input } from 'reactstrap';
import ValidationError from '../components/ValidationError';
// @ts-ignore
import AsyncSelect from 'react-select/async';
import { CourseService, ReadCourseTask } from '../services/course';

import '../index.scss';

type Props = {
    session?: Session;
    course: Course;
};

type State = {
    isLoading: boolean;
}

type Verification = 'auto' | 'manual' | 'verification';

type Interview = {
    name: string;
    verification: Verification,
}

const formatDisplayValue = (data: ReadCourseTask) => {
    return `${data.name}`;
};

const Option = (props: any) => {
    const data: ReadCourseTask = props.data;

    return (
      <components.Option {...props} key={data.courseTaskId}>
        {formatDisplayValue(data)}
      </components.Option>
    );
  };

const SingleValue = (props: any) => {
    const data: ReadCourseTask = props.data;

    return (
        <components.SingleValue {...props} value={data.courseTaskId}>
            {formatDisplayValue(data)}
        </components.SingleValue>
    );
};
class FeedbackPage extends React.Component<Props, State> {
    state: State = {
        isLoading: false,
    };

    private courseService: CourseService;

    constructor(props: Readonly<Props>) {
        super(props);
        this.courseService = new CourseService(this.props.course.id);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.loadTasks = this.loadTasks.bind(this);
    }

    async loadTasks() {
        const tasks = await this.courseService.getCourseTasks();
        return tasks.map((t) => t.verification === 'interview');
    }

    handleSubmit() {
        console.log('Restart');
    }

    renderForm({ handleSubmit }: FormRenderProps) {
        return (
            <LoadingScreen show={this.state.isLoading}>
                <form onSubmit={handleSubmit}>
                    <Field name="task">
                        {({ meta, input }) => (
                            <FormGroup className="col-md-6">
                                <Label>Interview</Label>
                                <AsyncSelect
                                    placeholder={'Interview'}
                                    noOptionsMessage={() => 'Start typing...'}
                                    cacheOptions={true}
                                    components={{ Option, SingleValue }}
                                    loadOptions={this.loadTasks}
                                    onChange={(value: any) => input.onChange(value)}
                                />
                                <ValidationError meta={meta} />
                            </FormGroup>
                        )}
                    </Field>
                    <Field name="comment">
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
                            <Button type="submit" color="success">Submit</Button>
                        </div>
                    </div>
                </form>
            </LoadingScreen>
        );
    }

    render() {
        if (!this.props.session) {
            return null;
          }

        return (
            <>
                <Header username={this.props.session.githubId} />
                <div className="m-3">
                    <h3 className="mb-3">Submit interview feedback</h3>
                </div>
                <Form onSubmit={this.handleSubmit} render={this.renderForm} />
            </>
        );
    }
};

export default withCourseData(withSession(FeedbackPage));