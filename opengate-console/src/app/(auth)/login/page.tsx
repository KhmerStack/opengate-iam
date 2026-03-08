'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/lib/pkce';
import { RefreshCw } from 'lucide-react';

const AUTH_URL  = 'http://localhost:9081';
const CLIENT_ID = 'sample-app';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]             = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('opengate_token')) {
      router.push('/dashboard');
    }
  }, []);

  const startPkceFlow = async (forceLogin = false) => {
    const verifier  = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state     = generateState();

    sessionStorage.setItem('pkce_verifier', verifier);
    sessionStorage.setItem('oauth_state',   state);

    const params = new URLSearchParams({
      response_type:         'code',
      client_id:             CLIENT_ID,
      redirect_uri:          'http://localhost:3002/callback',
      scope:                 'openid profile email',
      state,
      code_challenge:        challenge,
      code_challenge_method: 'S256',
    });

    if (forceLogin) params.set('prompt', 'login');

    window.location.href = `${AUTH_URL}/oauth2/authorize?${params}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2A' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #0077a8)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OpenGate IAM</h1>
          <p className="text-gray-500 mt-1 text-sm">Admin Console</p>
        </div>

        {/* Login with OpenGate */}
        <button
          onClick={() => { setLoading(true); startPkceFlow(false); }}
          disabled={loading || switchLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 hover:opacity-90 shadow-md"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #0077a8)' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {loading ? 'Redirecting…' : 'Login with OpenGate IAM'}
        </button>

        {/* Switch account */}
        <button
          onClick={() => {
            setSwitchLoading(true);
            localStorage.removeItem('opengate_token');
            localStorage.removeItem('opengate_refresh_token');
            localStorage.removeItem('opengate_user');
            sessionStorage.removeItem('pkce_verifier');
            sessionStorage.removeItem('oauth_state');
            startPkceFlow(true);
          }}
          disabled={loading || switchLoading}
          className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={switchLoading ? 'animate-spin' : ''} />
          {switchLoading ? 'Switching…' : 'Switch Account / Test Different User'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Accounts: <span className="font-mono text-gray-600">admin / admin</span>
          {' · '}
          <span className="font-mono text-gray-600">user / user</span>
        </p>
      </div>
    </div>
  );
}
