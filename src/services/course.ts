import axios from 'axios';

export interface ReadCourseTask {
  courseTaskId: number;
  taskId: number;
  name: string;
  maxScore: number | null;
  scoreWeight: number;
  stageId: number;
  githubPrRequired: boolean;
  description: string | null;
  descriptionUrl: string | null;
  studentStartDate: string | null;
  studentEndDate: string | null;
  taskResultCount: number;
}

export interface CreateCourseTask {
  taskId: number;
  maxScore?: number;
  scoreWeight?: number;
  stageId: number;
}

export interface Stage {
  id: number;
  createdDate: string;
  updatedDate: string;
  name: string;
}

export class CourseService {
  constructor(private courseId: number) {}

  async getCourseTasks() {
    const result = await axios.get<{ data: ReadCourseTask[] }>(`/api/course/${this.courseId}/tasks`);
    return result.data.data;
  }

  async getStages() {
    const result = await axios.get<{ data: Stage[] }>(`/api/course/${this.courseId}/stages`);
    return result.data.data;
  }

  async createCourseTask(data: CreateCourseTask) {
    const result = await axios.post(`/api/course/${this.courseId}/task`, data);
    return result.data.data;
  }

  async updateCourseTask(courseTaskId: number, data: any) {
    const result = await axios.put(`/api/course/${this.courseId}/task/${courseTaskId}`, data);
    return result.data.data;
  }

  async deleteCourseTask(courseTaskId: number) {
    const result = await axios.delete(`/api/course/${this.courseId}/task/${courseTaskId}`);
    return result.data.data;
  }
}
