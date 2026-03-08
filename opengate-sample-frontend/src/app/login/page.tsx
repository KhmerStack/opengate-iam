'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, OPENGATE_URL, CLIENT_ID } from '@/lib/auth';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/lib/pkce';
import { Shield, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router  = useRouter();
  const [loading, setLoading]             = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.push('/products');
  }, []);

  /** Start PKCE flow — optionally force re-auth by adding prompt=login */
  const startOAuthFlow = async (forceLogin = false) => {
    const verifier  = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state     = generateState();

    sessionStorage.setItem('pkce_verifier', verifier);
    sessionStorage.setItem('oauth_state',   state);

    const params = new URLSearchParams({
      response_type:         'code',
      client_id:             CLIENT_ID,
      redirect_uri:          'http://localhost:3003/callback',
      scope:                 'openid profile email',
      state,
      code_challenge:        challenge,
      code_challenge_method: 'S256',
    });

    // prompt=login forces OpenGate to show the login form even with an active session
    if (forceLogin) params.set('prompt', 'login');

    window.location.href = `${OPENGATE_URL}/oauth2/authorize?${params}`;
  };

  const handleLogin = async () => {
    setLoading(true);
    await startOAuthFlow(false);
  };

  const handleSwitchAccount = async () => {
    setSwitchLoading(true);
    logout();                        // clear local tokens
    await startOAuthFlow(true);      // prompt=login → always show login form
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)' }}>
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #00B4D8, #0077a8)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Demo App</h1>
            <p className="text-sm text-gray-500 mt-1">Protected by OpenGate IAM</p>
          </div>

          {/* Primary login button */}
          <button
            onClick={handleLogin}
            disabled={loading || switchLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98] shadow-md"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #0077a8)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {loading ? 'Redirecting to OpenGate…' : 'Login with OpenGate IAM'}
          </button>

          {/* Switch account button */}
          <button
            onClick={handleSwitchAccount}
            disabled={loading || switchLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={switchLoading ? 'animate-spin' : ''} />
            {switchLoading ? 'Switching account…' : 'Switch Account / Test Different User'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">OAuth 2.1 + PKCE flow</span>
            </div>
          </div>

          {/* Flow steps */}
          <ol className="space-y-2 text-xs text-gray-500">
            {[
              'Generates PKCE code_verifier & code_challenge (SHA-256)',
              'Redirects to OpenGate /oauth2/authorize',
              'You log in on OpenGate login page (admin/admin or user/user)',
              'OpenGate redirects back with authorization code',
              'Callback exchanges code + verifier for JWT',
              'JWT stored — Bearer token on every API request',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                  style={{ background: '#00B4D8' }}>{i + 1}</span>
                <span className="leading-5">{step}</span>
              </li>
            ))}
          </ol>

          {/* Badge */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2">
            <Shield size={13} className="text-cyan-500" />
            <span className="text-xs text-gray-400">
              Secured by <span className="font-medium text-gray-600">OpenGate IAM</span>
              {' · '}realm <span className="font-medium text-gray-600">master</span>
            </span>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-4">
          OpenGate IAM · OAuth 2.1 · PKCE · Spring Authorization Server
        </p>
        <div className="mt-2 text-center space-x-3 text-xs">
          <span className="text-white/40">Accounts:</span>
          <span className="font-mono text-cyan-400/70">admin / admin</span>
          <span className="text-white/30">·</span>
          <span className="font-mono text-cyan-400/70">user / user</span>
        </div>
      </div>
    </div>
  );
}
