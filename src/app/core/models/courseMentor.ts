import { IUserBase } from './user';

export interface ICouseUser {
    _id: string;
    city: string;
    courseId: string;
    userId: string;
    excludeReason: string | undefined;
    isActive: boolean;
}

export interface ICourseMentor extends ICouseUser {
    menteeCapacity: number;
    mentees: Array<IUserBase>;
    preferedMentees: Array<IUserBase>;
}
