'use client';

const TOKEN_KEY = 'og_token';
const USER_KEY  = 'og_user';

export const OPENGATE_URL  = 'http://localhost:9081';
export const SAMPLE_API    = 'http://localhost:8090';
export const CLIENT_ID     = 'sample-app';
export const CLIENT_SECRET = 'sample-secret';

export async function loginWithPassword(username: string, password: string): Promise<void> {
  // For demo: use client_credentials with client secret
  // In production: use authorization_code + PKCE flow
  const res = await fetch(`${OPENGATE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'openid profile',
    }),
  });

  if (!res.ok) throw new Error('Authentication failed');
  const data = await res.json();

  localStorage.setItem(TOKEN_KEY, data.access_token);

  // Decode JWT payload to get user info
  const payload = JSON.parse(atob(data.access_token.split('.')[1]));
  localStorage.setItem(USER_KEY, JSON.stringify({
    userId:   payload.sub,
    username: username,
    email:    payload.email ?? username + '@demo.com',
    roles:    payload.roles ?? [],
    realm:    payload.realm ?? 'master',
  }));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${SAMPLE_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    logout();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res.json();
}
