import * as React from 'react';
import { FormGroup, Label, Button, Input } from 'reactstrap';
import { Field } from 'react-final-form';
import ReactTable from 'react-table';

import { CourseService, ReadCourseTask, Stage } from '../services/course';
import { TaskService, Task } from '../services/task';

import Header from '../components/Header';

import withSession, { Session } from '../components/withSession';
import withCourseData, { Course } from '../components/withCourseData';
import { TaskEditModal } from '../components/TasksForm/TaskEditModal';
import ValidationError from '../components/ValidationError';

import '../index.scss';

const required = (value: any) => (value ? undefined : 'Required');

type Props = {
  session?: Session;
  course: Course;
};

type State = {
  tasks: Task[];
  courseTasks: ReadCourseTask[];
  stages: Stage[];
  modalValues: any;
  modalAction: 'update' | 'create';
};

class CourseTasksPage extends React.Component<Props, State> {
  state: State = {
    tasks: [],
    courseTasks: [],
    stages: [],
    modalValues: undefined,
    modalAction: 'update',
  };

  private courseService: CourseService;

  constructor(props: Props) {
    super(props);
    this.courseService = new CourseService(props.course.id);
  }

  async componentDidMount() {
    const taskService = new TaskService();
    const [courseTasks, stages, tasks] = await Promise.all([
      this.courseService.getCourseTasks(),
      this.courseService.getStages(),
      taskService.getTasks(),
    ]);
    this.setState({ courseTasks, stages, tasks });
  }

  render() {
    if (!this.props.session) {
      return null;
    }
    return (
      <div>
        <Header username={this.props.session.githubId} />
        {this.renderModal()}
        <Button color="success" onClick={this.handleAddTaskClick}>
          Add
        </Button>
        <ReactTable
          className="-striped -highlight"
          data={this.state.courseTasks}
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          defaultSorted={[{ id: 'id', desc: true }]}
          filterable={true}
          columns={[
            { Header: 'Course Task Id', accessor: 'courseTaskId', maxWidth: 100 },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Scores Count', accessor: 'taskResultCount', maxWidth: 100 },
            { Header: 'End Date', accessor: 'studentEndDate', maxWidth: 300 },
            { Header: 'Max Score', accessor: 'maxScore', maxWidth: 150, sortMethod: this.sortNumber },
            { Header: 'Score Weight', accessor: 'scoreWeight', maxWidth: 150, sortMethod: this.sortNumber },
            {
              Header: 'Actions',
              filterable: false,
              maxWidth: 200,
              Cell: row => (
                <>
                  <Button color="link" onClick={() => this.handleUpdateRowClick(row)}>
                    Edit
                  </Button>
                  <Button color="link" onClick={() => this.handleDeleteRowClick(row)}>
                    Remove
                  </Button>
                </>
              ),
            },
          ]}
        />
      </div>
    );
  }

  renderModal() {
    return (
      <TaskEditModal
        onApply={this.handleSubmit}
        onClose={() => this.setState({ modalValues: null })}
        isOpen={this.state.modalValues != null}
        initialValues={{
          ...this.state.modalValues,
        }}
      >
        <FormGroup className="col-md-auto">
          {this.state.modalAction === 'create' && (
            <Field name="taskId" validate={required}>
              {({ input, meta }) => (
                <>
                  <Label>Task</Label>
                  <Input {...input} name="name" type="select">
                    <option value="">(Empty)</option>
                    {this.state.tasks
                      .filter(task => !this.state.courseTasks.some(courseTask => courseTask.taskId === task.id))
                      .map(task => (
                        <option key={task.id} value={task.id}>
                          {task.name}
                        </option>
                      ))}
                  </Input>
                  <ValidationError meta={meta} />
                </>
              )}
            </Field>
          )}
          <Field name="stageId" validate={required}>
            {({ input, meta }) => (
              <>
                <Label>Stage</Label>
                <Input {...input} name="name" type="select">
                  <option value="">(Empty)</option>
                  {this.state.stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </Input>
                <ValidationError meta={meta} />
              </>
            )}
          </Field>
          <Field name="maxScore">
            {({ input }) => (
              <>
                <Label>Max Score</Label>
                <Input {...input} name="maxScore" type="number" />
              </>
            )}
          </Field>
        </FormGroup>
        <FormGroup className="col-md-auto">
          <Field name="scoreWeight">
            {({ input }) => (
              <>
                <Label>Score Weight</Label>
                <Input {...input} name="scoreWeight" type="number" />
              </>
            )}
          </Field>
        </FormGroup>
      </TaskEditModal>
    );
  }

  private sortNumber = (a: number, b: number) => b - a;

  private handleAddTaskClick = () => {
    this.setState({ modalValues: {}, modalAction: 'create' });
  };

  private handleUpdateRowClick = (row: any) => {
    this.setState({ modalValues: row.original });
  };

  private handleDeleteRowClick = async (row: any) => {
    await this.courseService.deleteCourseTask(row.original.courseTaskId);
    const courseTasks = await this.courseService.getCourseTasks();
    this.setState({ courseTasks });
  };

  private handleSubmit = async (values: any) => {
    const data = {
      maxScore: values.maxScore ? Number(values.maxScore) : undefined,
      stageId: values.stageId,
      scoreWeight: values.scoreWeight,
    };
    if (this.state.modalAction === 'create') {
      this.courseService.createCourseTask({
        ...data,
        taskId: values.taskId,
      });
    } else {
      this.courseService.updateCourseTask(values.courseTaskId, data);
    }
    const courseTasks = await this.courseService.getCourseTasks();
    this.setState({ modalValues: null, courseTasks });
  };
}

export default withCourseData(withSession(CourseTasksPage));
