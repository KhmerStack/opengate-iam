'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const AUTH_URL  = 'http://localhost:9081';
const CLIENT_ID = 'sample-app';

function CallbackInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
    const err   = searchParams.get('error');

    if (err) { setError(`Auth error: ${searchParams.get('error_description') ?? err}`); return; }
    if (!code) { setError('No authorization code received.'); return; }
    if (state !== sessionStorage.getItem('oauth_state')) {
      setError('State mismatch — possible CSRF. Please try again.'); return;
    }

    const verifier = sessionStorage.getItem('pkce_verifier');
    if (!verifier) { setError('PKCE verifier missing. Please try again.'); return; }

    fetch(`${AUTH_URL}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        client_id:     CLIENT_ID,
        redirect_uri:  'http://localhost:3002/callback',
        code,
        code_verifier: verifier,
      }),
    })
      .then(r => r.json())
      .then(tokens => {
        if (tokens.error) throw new Error(tokens.error_description ?? tokens.error);

        localStorage.setItem('opengate_token', tokens.access_token);
        if (tokens.refresh_token) localStorage.setItem('opengate_refresh_token', tokens.refresh_token);

        const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
        localStorage.setItem('opengate_user', JSON.stringify({
          username: payload.preferred_username ?? payload.sub,
          roles:    payload.roles ?? [],
          realm:    payload.realm ?? 'master',
        }));

        sessionStorage.removeItem('pkce_verifier');
        sessionStorage.removeItem('oauth_state');
        router.push('/dashboard');
      })
      .catch(e => setError(`Token exchange failed: ${e.message}`));
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2A' }}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="font-bold text-gray-900 mb-2">Authentication Failed</h2>
        <p className="text-sm text-red-600 mb-5">{error}</p>
        <button onClick={() => router.push('/login')}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: '#00B4D8' }}>Back to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2A' }}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#00B4D8' }}>
          <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
          </svg>
        </div>
        <h2 className="font-bold text-gray-900">Signing you in…</h2>
        <p className="text-sm text-gray-500 mt-1">Exchanging authorization code</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return <Suspense><CallbackInner /></Suspense>;
}
