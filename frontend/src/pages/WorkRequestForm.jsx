import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import workerService from '../services/workerService';
import requestService from '../services/requestService';
import { ArrowLeft, Send, MapPin, Phone, AlertCircle, FileText } from 'lucide-react';

const WorkRequestForm = () => {
  const { id } = useParams(); // workerId
  const [worker, setWorker] = useState(null);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const data = await workerService.getWorkerById(id);
        setWorker(data);
      } catch (err) {
        setError('Unable to fetch worker information.');
      } finally {
        setLoadingWorker(false);
      }
    };

    fetchWorker();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.address || !formData.phone) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await requestService.createRequest({
        workerId: parseInt(id),
        description: formData.description,
        address: formData.address,
        phone: formData.phone
      });
      navigate('/customer-dashboard');
    } catch (err) {
      setError('Failed to submit work request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingWorker) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading worker information...</p>;
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
      <Link to={`/workers/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Worker Details
      </Link>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Request Work</h2>
          {worker && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Sending request to <strong>{worker.name}</strong> ({worker.skill})
            </p>
          )}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Describe the Work Needed
            </label>
            <textarea
              name="description"
              className="form-input"
              rows="4"
              placeholder="e.g. Kitchen tap is leaking constantly. Need it fixed today."
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
              style={{ resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Service Address
            </label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="e.g. MVP Colony, Sector 3, House 42"
              value={formData.address}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Your Contact Number for this job
            </label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="e.g. 9876543211"
              value={formData.phone}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }} disabled={submitting}>
            {submitting ? 'Submitting Request...' : 'Submit Request'}
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkRequestForm;
