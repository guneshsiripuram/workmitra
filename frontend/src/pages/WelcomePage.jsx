import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, MapPin, CheckCircle, Users } from 'lucide-react';

const WelcomePage = () => {
  const { user } = useAuth();

  // If already logged in, redirect them directly to their dashboard
  if (user) {
    const defaultRoute = user.role === 'CUSTOMER' ? '/customer-dashboard' : '/worker-dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '40px 0' }} className="animate-fade-in">
      {/* Hero Section */}
      <h1 className="heading-gradient" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2', maxWidth: '800px' }}>
        Connecting Local Demand with Skilled Hands
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '600px' }}>
        WorkMitra connects people who need help with verified service professionals in their neighborhood. Safe, transparent, and direct.
      </p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
          Get Started
          <ArrowRight size={18} />
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
          Sign In
        </Link>
      </div>

      {/* Feature Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '1000px' }}>
        <div className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <MapPin size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Local & Nearby</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Find carpenters, plumbers, painters, electricians, and mechanics operating right in your specific locality.
          </p>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Shield size={24} style={{ color: 'var(--secondary)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Trusted Workers</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Browse profiles with verified experience, location tags, and real ratings left by other customers in your area.
          </p>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Direct Connections</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No agency fees or commissions. Direct chat, direct scheduling, and transparent request management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
