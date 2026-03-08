import apiClient from './client';
import { OAuthClient } from '../types';

export const clientApi = {
  list: async (realm: string): Promise<OAuthClient[]> => {
    const { data } = await apiClient.get(`/admin/realms/${realm}/clients`);
    return data;
  },
  create: async (realm: string, payload: Partial<OAuthClient>): Promise<OAuthClient> => {
    const { data } = await apiClient.post(`/admin/realms/${realm}/clients`, payload);
    return data;
  },
  regenerateSecret: async (realm: string, clientId: string): Promise<{ clientSecret: string }> => {
    const { data } = await apiClient.post(`/api/realms/${realm}/clients/${clientId}/secret/regenerate`);
    return data;
  },
  delete: async (realm: string, clientId: string): Promise<void> => {
    await apiClient.delete(`/api/realms/${realm}/clients/${clientId}`);
  },
};
