import apiClient from './client';
import { Session } from '../types';

export const sessionApi = {
  getByUser: async (userId: string): Promise<Session[]> => {
    const { data } = await apiClient.get(`/api/users/${userId}/sessions`);
    return data;
  },
  terminate: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/api/sessions/${sessionId}`);
  },
  terminateAll: async (userId: string): Promise<void> => {
    await apiClient.delete(`/api/users/${userId}/sessions`);
  },
};
