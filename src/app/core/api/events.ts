import axios from 'axios';

type EventsResponse = {
    data: any[];
};

export function getEventsByCourseId(courseId: string) {
    return axios.get<EventsResponse>(`/api/course/${courseId}/events`);
}
