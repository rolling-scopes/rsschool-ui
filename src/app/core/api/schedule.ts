import axios from 'axios';

import { IEvent, IStage } from '../models';

type EventsResponse = {
    data: IEvent[];
};

type StagesResponse = {
    data: IStage[];
};

export function getEventsByCourseId(courseId: string) {
    return axios.get<EventsResponse>(`/api/course/${courseId}/events`);
}

export function getEventsAndStagesByCourseId(courseId: string) {
    return Promise.all([
        getEventsByCourseId(courseId),
        axios.get<StagesResponse>(`/api/course/${courseId}/stages`),
    ]).then(([events, stages]) => ({
        events: events.data,
        stages: stages.data,
    }));
}
