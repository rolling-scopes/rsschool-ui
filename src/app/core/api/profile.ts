import axios from 'axios';
import { IProfile } from '../models';

type ProfileResponse = {
    data: IProfile;
};

export function updateProfile(data: any) {
    return axios.patch<ProfileResponse>(`/api/profile`, data).then(response => response.data.data);
}

export function getProfile() {
    return axios.get<ProfileResponse>(`/api/profile`).then(response => response.data.data);
}
