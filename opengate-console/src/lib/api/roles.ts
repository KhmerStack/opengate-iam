import apiClient from './client';
import { Role } from '../types';

export const roleApi = {
  list: async (realm: string): Promise<Role[]> => {
    const { data } = await apiClient.get(`/api/realms/${realm}/roles`);
    return data;
  },
  create: async (realm: string, payload: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.post(`/api/realms/${realm}/roles`, payload);
    return data;
  },
  delete: async (realm: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/realms/${realm}/roles/${id}`);
  },
  assignToUser: async (realm: string, userId: string, roleId: string): Promise<void> => {
    await apiClient.post(`/api/realms/${realm}/users/${userId}/role-mappings`, { roleId });
  },
};
