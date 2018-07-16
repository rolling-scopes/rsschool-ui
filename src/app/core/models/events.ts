export enum EventType {
    Session = 'session',
    Task = 'task',
}

export enum SessionType {
    Online = 'Online',
    Offline = 'Offline',
    SelfLearning = 'Self-learning',
    ExtraEvent = 'Extra Event',
}

export enum TaskType {
    Task = 'Task',
    CodeJam = 'Code Jam',
    Interview = 'Interview',
    Test = 'Test',
}

export enum WhoChecks {
    Mentor = 'Mentor',
    RandomMentor = 'Random Mentor',
    Trainer = 'Trainer',
    UnitTest = 'Unit Test',
    ExternalPerson = 'External Person',
    WithoutChecking = 'Without Checking',
    Codewars = 'Codewars',
    Codecademy = 'Codecademy',
    Duolingo = 'Duolingo',
}

export interface IEvent {
    courseId: string;
    endDateTime?: number;
    location?: string;
    descriptionFileUrl?: string;
    startDateTime: number;
    sessionType?: SessionType;
    trainer?: string;
    type: EventType;
    title: string;
    taskType?: TaskType;
    whoChecks?: WhoChecks;
}

export interface IEventDocument extends IEvent {
    _id: string;
}
