import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Upgrade = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <Link to="/chat" style={{ textDecoration: 'none' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="text-gradient" size={24} />
            DocuMind
            </h2>
        </Link>
      </nav>

      <section className="landing-section" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-10vh' }}>
        <div className="base-panel" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem', background: 'var(--hover-bg)', padding: '16px', borderRadius: '50%' }}>
            <Sparkles color="var(--accent-primary)" size={40} />
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Thank you for using DocuMind.</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            You've hit the limit of our free tier! We are currently building DocuMind Pro for power users who need unrestricted access to intelligent context retrieval. 
          </p>

          {!isSuccess ? (
            <>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Join the waitlist to be first in line.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto', flexDirection: 'column' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1.1rem' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Joining...' : 'Get Early Access'}
                </button>
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
                </form>
            </>
          ) : (
            <div style={{ background: 'var(--hover-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                <CheckCircle2 color="#10b981" size={48} style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>You're on the list!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>We'll email you as soon as DocuMind Pro is ready.</p>
            </div>
          )}

          <div style={{ marginTop: '3rem' }}>
            <Link to="/chat" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
                Return to Chat <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upgrade;
