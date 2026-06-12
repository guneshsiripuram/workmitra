import React, { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import { Check, X, Phone, MapPin, User, FileText, Calendar, Inbox } from 'lucide-react';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await requestService.getRequestsForWorker();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch incoming requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    try {
      await requestService.updateRequestStatus(requestId, status);
      // Refresh the request list after status update
      fetchRequests();
    } catch (err) {
      alert('Error updating request status. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Incoming Requests</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Manage customer bookings and request statuses</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading incoming requests...</p>
      ) : error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Inbox size={48} style={{ color: 'var(--primary)', marginBottom: '16px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>No requests yet</h3>
          <p style={{ fontSize: '0.9rem' }}>When customers request your services, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((req) => (
            <div key={req.requestId} className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>{req.customerName}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Booking ID: #{req.requestId}</p>
                  </div>
                </div>
                <span className={`status-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>

              {/* Request details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <FileText size={16} style={{ color: 'var(--text-muted)', marginTop: '3px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{req.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{req.address}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Phone:</strong> {req.phone}
                  </p>
                </div>
              </div>

              {/* Action buttons (only visible if request is PENDING) */}
              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button onClick={() => handleAction(req.requestId, 'ACCEPTED')} className="btn btn-success" style={{ flex: 1, padding: '10px' }}>
                    <Check size={16} /> Accept
                  </button>
                  <button onClick={() => handleAction(req.requestId, 'REJECTED')} className="btn btn-danger" style={{ flex: 1, padding: '10px' }}>
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
