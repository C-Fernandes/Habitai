
import type { User, UserRegisterData } from '../types';
import { apiClient } from './apiClient';
const url = '/users';

export const userService = {

    register: (data: UserRegisterData): Promise<User> => {console.log(data);

        return apiClient.post<User>(`${url}/register`, data);
    },

    getAll: (): Promise<User[]> => {
        return apiClient.get<User[]>(url);
    },

    getById: (id: string): Promise<User> => {
        return apiClient.get<User>(`${url}/${id}`);
    },
    login: async (email: string, password: string): Promise<string> => {
        const credentials = { email, password };
        return apiClient.post<string>(`${url}/login`, credentials);
    },
    update: (id: string, data: User): Promise<User> => {
        return apiClient.put<User>(`${url}/${id}`, data);
    },

    delete: (id: string): Promise<void> => {
        return apiClient.delete(`${url}/${id}`);
    },
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<User>('/users/me');
        return response;
    }, 
    deactivateAccount: (id: string): Promise<void> => {
        return apiClient.delete(`${url}/me?id=${id}`);
    },
};