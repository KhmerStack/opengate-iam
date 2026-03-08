export interface Realm {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  mfaRequired: boolean;
  tokenLifespanSeconds: number;
  refreshTokenLifespanSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  realmName: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  realmName: string;
  name: string;
  description: string;
  composite: boolean;
  createdAt: string;
}

export interface OAuthClient {
  id: string;
  realmName: string;
  clientId: string;
  publicClient: boolean;
  pkceRequired: boolean;
  redirectUris: string[];
  webOrigins: string[];
  grantTypes: string[];
  scopes: string[];
  createdAt: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  realmId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastAccessedAt: string;
  expiresAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  registeredClients: number;
  totalRealms: number;
}
