import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import workerService from '../services/workerService';
import { ArrowLeft, Briefcase, MapPin, Phone, Award, User } from 'lucide-react';

const WorkerDetailsPage = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const data = await workerService.getWorkerById(id);
        setWorker(data);
      } catch (err) {
        setError('Worker details not found or profile is not set up.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerDetails();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading worker profile...</p>;
  }

  if (error || !worker) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }} className="animate-fade-in">
        <p style={{ color: 'var(--danger)', marginBottom: '20px' }}>{error || 'Worker details not available.'}</p>
        <Link to="/customer-dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
      <Link to="/customer-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Profile Image */}
        <img
          src={worker.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
          alt={worker.name}
          style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', border: '2px solid var(--border-color)', marginBottom: '24px', boxShadow: 'var(--shadow-lg)' }}
        />

        {/* Worker Name & Role Badge */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px' }}>{worker.name}</h2>
        <span className="status-badge worker" style={{ fontSize: '0.75rem', marginBottom: '24px' }}>
          {worker.skill}
        </span>

        {/* Detailed Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)' }}>
            <Award size={20} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</span>
            <span style={{ fontSize: '1rem', fontWeight: '700' }}>{worker.experience} Years</span>
          </div>

          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)' }}>
            <MapPin size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service Area</span>
            <span style={{ fontSize: '1rem', fontWeight: '700' }}>{worker.location}</span>
          </div>
        </div>

        {/* Contact info list */}
        <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              <User size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Worker Name</p>
              <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>{worker.name}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              <Phone size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Number</p>
              <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>{worker.phone}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/request-work/${worker.userId}`} className="btn btn-primary btn-block" style={{ fontSize: '1rem', padding: '14px' }}>
          Request Work
        </Link>
      </div>
    </div>
  );
};

export default WorkerDetailsPage;
