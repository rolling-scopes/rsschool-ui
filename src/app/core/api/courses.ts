import axios from 'axios';
import { ICourse } from 'core/models';

type CoursesResponse = {
    data: ICourse[];
};

export function getCourses() {
    return axios.get<CoursesResponse>(`/api/courses`).then(response => response.data.data);
}

export function enrollUserInCourse(id: string) {
    return axios.post<CoursesResponse>(`/api/course/${id}/enroll`);
}
