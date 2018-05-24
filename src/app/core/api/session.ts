import axios from 'axios';

type SessionResponse = {
    id: string;
};

export function getSession() {
    return axios.get<SessionResponse>(`/api/session`);
}
