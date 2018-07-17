import axios from 'axios';

import { IEvent, IEventDocument, IStageDocument, IStage } from '../models';

type EventsResponse = {
    data: IEventDocument[];
};

type StagesResponse = {
    data: IStageDocument[];
};

type StagePostResponse = IStageDocument;

type StagePatchResponse = {
    data: IStageDocument;
};

type EventPostResponse = IEventDocument;

type EventPatchResponse = {
    data: IEventDocument;
};

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

export function addStageApi(stage: IStage) {
    return axios.post<StagePostResponse>(`/api/stage`, stage).then(response => response.data);
}

export function updateStageApi(stage: IStageDocument) {
    return axios.patch<StagePatchResponse>(`/api/stage`, stage).then(response => response.data.data);
}

export function deleteStageApi(id: string) {
    return axios.delete(`/api/stage/${id}`);
}

export function addEventApi(event: IEvent) {
    return axios.post<EventPostResponse>(`/api/event`, event).then(response => response.data);
}

export function updateEventApi(event: IEventDocument) {
    return axios.patch<EventPatchResponse>(`/api/event`, event).then(response => response.data.data);
}

export function deleteEventApi(id: string) {
    return axios.delete(`/api/event/${id}`);
}
