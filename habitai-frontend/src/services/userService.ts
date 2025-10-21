import type { AuthUser } from '../context/AuthContext';
import type { LoginCredentials, User, UserRegisterData } from '../types';
import { apiClient } from './apiClient';
const url = '/users'; // Adicionei o prefixo '/api' que definimos no backend

export const userService = {

    register: (data: UserRegisterData): Promise<User> => {
        return apiClient.post<User>(url, data);
    },

    getAll: (): Promise<User[]> => {
        return apiClient.get<User[]>(url);
    },

    getById: (id: number): Promise<User> => {
        return apiClient.get<User>(`${url}/${id}`);
    },
    login: (email: string, password: string): Promise<AuthUser> => {
        const credentials = { email, password };
        return apiClient.post<AuthUser>(`${url}/login`, credentials);

    },
    update: (id: number, data: User): Promise<User> => {
        return apiClient.put<User>(`${url}/${id}`, data);
    },

    delete: (id: number): Promise<void> => {
        return apiClient.delete(`${url}/${id}`);
    },
    getProfile: async (email: string): Promise<User> => {
        const response = await apiClient.get<User>(`/users/me?email=${email}`);
        return response;
    },
};