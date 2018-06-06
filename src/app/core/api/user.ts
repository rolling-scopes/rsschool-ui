import axios from 'axios';
import { ICourse, IProfile, IUserParticipation } from '../models';

type ProfileResponse = {
    data: IProfile;
};

type UserCoursesResponse = {
    data: IUserParticipation[];
};

type FeedResponse = {
    data: any[];
};

export function updateProfile(data: any): Promise<IProfile> {
    return axios.patch<ProfileResponse>(`/api/user/profile`, data).then(response => response.data.data);
}

export function getProfile(): Promise<IProfile> {
    return axios.get<ProfileResponse>(`/api/user/profile`).then(response => response.data.data);
}

export function getUserParticipations(): Promise<IUserParticipation[]> {
    return axios.get<UserCoursesResponse>(`/api/user/participations`).then(response => response.data.data);
}

export function getFeed(): Promise<ICourse[]> {
    return axios.get<FeedResponse>(`/api/user/feed`).then(response => response.data.data);
}
