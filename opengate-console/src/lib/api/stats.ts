import apiClient from './client';
import { AdminStats } from '../types';

export const statsApi = {
  get: async (realm = 'master'): Promise<AdminStats> => {
    const { data } = await apiClient.get(`/admin/realms/${realm}/stats`);
    return data;
  },
};
