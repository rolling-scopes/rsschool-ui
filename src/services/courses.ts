import axios from 'axios';
import { ICourse, ICourseStudent, ICourseMentor } from 'core/models';

type CoursesResponse = {
  data: ICourse[];
};

type CourseStudentsResponse = {
  data: ICourseStudent[];
};

type CourseMentorsResponse = {
  data: ICourseMentor[];
};

export function getCourses(): Promise<ICourse[]> {
  return axios.get<CoursesResponse>(`/api/courses`).then(response => response.data.data);
}

export function enrollUserInCourse(courseId: string) {
  return axios.post<CoursesResponse>(`/api/course/${courseId}/enroll`);
}

export function assignMentorsToStudents(courseId: string) {
  return axios.post<CoursesResponse>(`/api/course/${courseId}/mentors/assign`);
}

export function getCourseStudents(courseId: string): Promise<ICourseStudent[]> {
  return axios.get<CourseStudentsResponse>(`/api/course/${courseId}/students`).then(response => response.data.data);
}
export function getCourseMentors(courseId: string): Promise<ICourseMentor[]> {
  return axios.get<CourseMentorsResponse>(`/api/course/${courseId}/mentors`).then(response => response.data.data);
}
