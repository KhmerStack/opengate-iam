import apiClient from './client';
import { User, PageResponse } from '../types';

export const userApi = {
  list: async (realm: string, params?: { search?: string; page?: number; size?: number }): Promise<PageResponse<User>> => {
    const { data } = await apiClient.get(`/admin/realms/${realm}/users`, { params });
    return data;
  },
  get: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/api/users/${id}`);
    return data;
  },
  create: async (realm: string, payload: Partial<User> & { password?: string }): Promise<User> => {
    const { data } = await apiClient.post(`/admin/realms/${realm}/users`, payload);
    return data;
  },
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put(`/api/users/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/api/users/${id}/reset-password`, { newPassword });
  },
};
