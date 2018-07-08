export interface IStage {
    courseId: string;
    id: string;
    title: string;
    startDate: number;
    endDate: number;
}

export interface IStageDocument extends IStage {
    _id: string;
}
