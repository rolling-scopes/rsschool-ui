export interface IEventVenue {
    name: string;
    id: string;
}

export interface IEventTag {
    name: string;
    id: string;
}

export interface IEventSpeaker {
    name: string;
    id: string;
}

export interface IEvent {
    courseId: string;
    description: string;
    endDateTime: number;
    id: string;
    name: string;
    speakers: IEventSpeaker[];
    stage: string;
    startDateTime: number;
    tags: IEventTag[];
    venue: IEventVenue;
}

export interface IEventDocument extends IEvent {
    _id: string;
}
