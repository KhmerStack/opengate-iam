'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OPENGATE_URL, CLIENT_ID } from '@/lib/auth';
import { Suspense } from 'react';

function CallbackInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus]   = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState('Exchanging authorization code…');

  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authorization denied: ${searchParams.get('error_description') ?? error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received.');
      return;
    }

    // Validate state (CSRF protection)
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      setStatus('error');
      setMessage('State mismatch — possible CSRF attack. Please try logging in again.');
      return;
    }

    const verifier = sessionStorage.getItem('pkce_verifier');
    if (!verifier) {
      setStatus('error');
      setMessage('PKCE verifier missing from session. Please try logging in again.');
      return;
    }

    // Exchange authorization code for tokens
    exchangeCode(code, verifier);
  }, [searchParams]);

  const exchangeCode = async (code: string, verifier: string) => {
    try {
      setMessage('Exchanging code for tokens…');

      const res = await fetch(`${OPENGATE_URL}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type:    'authorization_code',
          client_id:     CLIENT_ID,
          redirect_uri:  'http://localhost:3003/callback',
          code,
          code_verifier: verifier,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const tokens = await res.json();

      // Store access token
      localStorage.setItem('og_token', tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem('og_refresh_token', tokens.refresh_token);
      }

      // Decode JWT payload to extract user info
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
      localStorage.setItem('og_user', JSON.stringify({
        userId:   payload.sub,
        username: payload.preferred_username ?? payload.sub,
        email:    payload.email ?? '',
        roles:    payload.roles ?? payload['realm_access']?.roles ?? [],
        realm:    payload.realm ?? 'master',
      }));

      // Clean up session storage
      sessionStorage.removeItem('pkce_verifier');
      sessionStorage.removeItem('oauth_state');

      setMessage('Login successful! Redirecting…');
      router.push('/products');
    } catch (err: any) {
      setStatus('error');
      setMessage(`Token exchange failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">

        {status === 'loading' ? (
          <>
            {/* Spinner */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #00B4D8, #0077a8)' }}>
              <svg className="animate-spin" width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Authenticating…</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-red-100">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Authentication Failed</h2>
            <p className="text-sm text-red-600 mt-2">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 px-5 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: '#00B4D8' }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
