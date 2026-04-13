import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AtSign, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate('/chat');
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Signup Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="base-panel auth-card">
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem', background: 'var(--hover-bg)', padding: '12px', borderRadius: '50%' }}>
          <Sparkles color="var(--accent-primary)" size={32} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Create account</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Get started with DocuMind</p>

        {error && (
          <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', marginTop: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          <div>
            <label className="auth-label">Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '16px' }} />
              <input
                className="input-field"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>
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
                minLength={6}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
            <UserPlus size={20} /> {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
