import axios from 'axios';
import { ICourse } from 'core/models';

type CoursesResponse = {
    data: ICourse[];
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
