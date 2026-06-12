import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">
        <Briefcase className="logo-icon" style={{ color: 'var(--primary)' }} size={24} />
        <span className="heading-gradient">WorkMitra</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                {user.name} 
              </span>
              <span className={`status-badge ${user.role.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                {user.role}
              </span>
            </div>
            
            {user.role === 'CUSTOMER' ? (
              <Link to="/customer-dashboard" className="nav-link">Dashboard</Link>
            ) : (
              <>
                <Link to="/worker-dashboard" className="nav-link">Requests</Link>
                <Link to="/profile" className="nav-link">Edit Profile</Link>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
