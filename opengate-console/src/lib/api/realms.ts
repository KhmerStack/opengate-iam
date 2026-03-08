import apiClient from './client';
import { Realm } from '../types';

export const realmApi = {
  list: async (): Promise<Realm[]> => {
    const { data } = await apiClient.get('/admin/realms');
    return data;
  },
  get: async (name: string): Promise<Realm> => {
    const { data } = await apiClient.get(`/admin/realms/${name}`);
    return data;
  },
  create: async (payload: Partial<Realm>): Promise<Realm> => {
    const { data } = await apiClient.post('/admin/realms', payload);
    return data;
  },
  update: async (name: string, payload: Partial<Realm>): Promise<Realm> => {
    const { data } = await apiClient.put(`/admin/realms/${name}`, payload);
    return data;
  },
  delete: async (name: string): Promise<void> => {
    await apiClient.delete(`/admin/realms/${name}`);
  },
};
