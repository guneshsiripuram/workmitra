import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import workerService from '../services/workerService';
import requestService from '../services/requestService';
import { Bolt, Wrench, Hammer, Car, Paintbrush, MapPin, Briefcase, Calendar, ChevronRight, HelpCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // List of hardcoded categories for filtering
  const categories = [
    { name: 'ELECTRICIAN', label: 'Electrician', icon: Bolt },
    { name: 'PLUMBER', label: 'Plumber', icon: Wrench },
    { name: 'CARPENTER', label: 'Carpenter', icon: Hammer },
    { name: 'MECHANIC', label: 'Mechanic', icon: Car },
    { name: 'PAINTER', label: 'Painter', icon: Paintbrush },
  ];

  // Fetch matching workers when category changes
  useEffect(() => {
    const fetchWorkers = async () => {
      setLoadingWorkers(true);
      try {
        const data = await workerService.getAllWorkers(selectedSkill);
        setWorkers(data);
      } catch (err) {
        console.error('Error fetching workers', err);
      } finally {
        setLoadingWorkers(false);
      }
    };

    fetchWorkers();
  }, [selectedSkill]);

  // Fetch request history
  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await requestService.getRequestsForCustomer();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching request history', err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCategorySelect = (skillName) => {
    if (selectedSkill === skillName) {
      setSelectedSkill(''); // Clear filter if clicked twice
    } else {
      setSelectedSkill(skillName);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', flex: 1 }} className="animate-fade-in">
      
      {/* 1. Category Filter Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>
          Select Category
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedSkill === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#fff' : 'var(--text-muted)'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Grid (Workers list & Request History) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Side: Workers List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>
            {selectedSkill ? `${selectedSkill.charAt(0) + selectedSkill.slice(1).toLowerCase()}s` : 'All Available Workers'}
          </h2>
          
          {loadingWorkers ? (
            <p style={{ color: 'var(--text-muted)' }}>Searching profiles...</p>
          ) : workers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <HelpCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No available workers found in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workers.map((worker) => (
                <div key={worker.userId} className="glass-panel glass-panel-interactive" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={worker.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
                    alt={worker.name}
                    style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{worker.name}</h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={12} />
                        {worker.skill} ({worker.experience} yrs)
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        {worker.location}
                      </span>
                    </div>
                  </div>
                  <Link to={`/workers/${worker.userId}`} className="btn btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px' }}>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Request History */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>
            My Requests
          </h2>

          {loadingRequests ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading history...</p>
          ) : requests.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>You haven't submitted any service requests yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map((req) => (
                <div key={req.requestId} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>{req.workerName}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Request ID: #{req.requestId}</p>
                    </div>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
                    {req.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span><strong>Address:</strong> {req.address}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
