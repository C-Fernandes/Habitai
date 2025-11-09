import type { AuthUser } from '../context/AuthContext';
import type { User, UserRegisterData } from '../types';
import { apiClient } from './apiClient';
const url = '/users';

export const userService = {

    register: (data: UserRegisterData): Promise<User> => {
        return apiClient.post<User>(url, data);
    },

    getAll: (): Promise<User[]> => {
        return apiClient.get<User[]>(url);
    },

    getById: (id: string): Promise<User> => {
        return apiClient.get<User>(`${url}/${id}`);
    },
    login: (email: string, password: string): Promise<AuthUser> => {
        const credentials = { email, password };
        return apiClient.post<AuthUser>(`${url}/login`, credentials);

    },
    update: (id: string, data: User): Promise<User> => {
        return apiClient.put<User>(`${url}/${id}`, data);
    },

    delete: (id: string): Promise<void> => {
        return apiClient.delete(`${url}/${id}`);
    },
    getProfile: async (id: string): Promise<User> => {
        const response = await apiClient.get<User>(`/users/me?id=${id}`);
        return response;
    }, deactivateAccount: (id: string): Promise<void> => {
        return apiClient.delete(`${url}/me?id=${id}`);
    },
};