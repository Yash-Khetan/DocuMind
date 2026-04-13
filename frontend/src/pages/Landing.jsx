import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-wrapper">
      
      <nav className="navbar">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className="text-gradient" size={24} />
          DocuMind
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn-secondary">Log in</Link>
          <Link to="/signup" className="btn-primary">Sign up</Link>
        </div>
      </nav>

      <section className="landing-section">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--hover-bg)', border: '1px solid var(--border-color)', borderRadius: '30px', color: 'var(--accent-primary)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <Sparkles size={16} /> New: Intelligent Context Sync
        </div>
        
        <h1 className="landing-title">
          Talk to your <span className="text-gradient">Knowledge.</span>
        </h1>
        <p className="landing-subtitle">
          Stop reading endless pages. Drop in your PDFs, manuals, or research papers, and let our intelligent assistant extract the answers you need in seconds.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/login" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Start Chatting Free <ArrowRight size={20} />
          </Link>
        </div>

        <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
          <div className="base-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', textAlign: 'left' }}>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.8rem', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                  <Sparkles size={24} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ height: '14px', background: 'var(--text-primary)', width: '150px', borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div style={{ height: '10px', background: 'var(--text-secondary)', width: '100px', borderRadius: '4px' }}></div>
                </div>
             </div>
             
             <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.5rem' }}></div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ alignSelf: 'flex-end', background: 'var(--accent-primary)', padding: '1.5rem', borderRadius: '16px 16px 0 16px', width: '60%' }}>
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.8)', width: '90%', borderRadius: '4px' }}></div>
                </div>
                <div style={{ alignSelf: 'flex-start', background: 'var(--hover-bg)', padding: '1.5rem', borderRadius: '16px 16px 16px 0', width: '80%', border: '1px solid var(--border-color)' }}>
                  <div style={{ height: '10px', background: 'var(--text-primary)', width: '100%', borderRadius: '4px', marginBottom: '10px' }}></div>
                  <div style={{ height: '10px', background: 'var(--text-secondary)', width: '70%', borderRadius: '4px' }}></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Intelligent retrieval</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem' }}>Find what you need exactly when you need it.</p>
        
        <div className="features-grid">
          <div className="base-panel feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Lightning Fast</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Our engine scans thousands of pages in milliseconds to map exact contextual geometry.</p>
          </div>
          
          <div className="base-panel feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Secure by Design</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Your documents are securely isolated and processed exclusively within your authorized context.</p>
          </div>
          
          <div className="base-panel feature-card">
            <div className="feature-icon"><Cpu size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Advanced Models</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Powered by advanced LLMs to guarantee deep understanding across any uploaded document structure.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="base-panel" style={{ padding: '5rem 2rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 800 }}>Ready to unlock your data?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Join thousands of users operating at peak cognitive efficiency.
          </p>
          <Link to="/login" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Get Started For Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;
