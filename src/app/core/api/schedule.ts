import axios from 'axios';

import { IEventDocument, IStageDocument, IStage } from '../models';

type EventsResponse = {
    data: IEventDocument[];
};

type StagesResponse = {
    data: IStageDocument[];
};

type StageResponse = IStageDocument;

function getEventsByCourseId(courseId: string) {
    return axios.get<EventsResponse>(`/api/course/${courseId}/events`);
}

function getStagesByCourseId(courseId: string) {
    return axios.get<StagesResponse>(`/api/course/${courseId}/stages`);
}

export function getEventsAndStagesByCourseId(courseId: string) {
    return Promise.all([getEventsByCourseId(courseId), getStagesByCourseId(courseId)]).then(([events, stages]) => ({
        events: events.data.data,
        stages: stages.data.data,
    }));
}

export function setStage(stage: IStage) {
    return axios.post<StageResponse>(`/api/stage`, stage).then(response => response.data);
}

export function updateStage(stage: IStage) {
    return axios.patch<StageResponse>(`/api/stage`, stage).then(response => response.data);
}
