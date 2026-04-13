import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../firebase';
import { LogIn, AtSign, Lock, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:");
      navigate('/chat');
    } catch (err) {
      setError("Invalid login credentials.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in with Google:", result.user);
      navigate('/chat');
    } catch (err) {
      setError("Google Login failed.");
      console.error("Google Login Error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="base-panel auth-card">
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem', background: 'var(--hover-bg)', padding: '12px', borderRadius: '50%' }}>
          <Sparkles color="var(--accent-primary)" size={32} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to DocuMind</p>

        {error && (
          <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', marginTop: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div>
            <label className="auth-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <AtSign size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>
          <div>
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
            <LogIn size={20} /> {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <button onClick={handleGoogleLogin} className="btn-secondary" style={{ width: '100%' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          Sign in via Google
        </button>

        <p style={{ marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="#" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
