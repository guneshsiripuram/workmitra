import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workerService from '../services/workerService';
import { useAuth } from '../context/AuthContext';
import { UserCheck, AlertCircle, CheckCircle, Briefcase, MapPin, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skill: 'ELECTRICIAN',
    experience: '',
    location: '',
    photoUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load existing profile if any
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await workerService.getWorkerById(user.userId);
        if (data) {
          setFormData({
            skill: data.skill,
            experience: data.experience,
            location: data.location,
            photoUrl: data.photoUrl || ''
          });
        }
      } catch (err) {
        // If profile doesn't exist yet, we just ignore the error and let them create a new one
        console.log('No profile found, worker needs to set up a new profile.');
      }
    };

    fetchProfile();
  }, [user.userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.experience || !formData.location) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await workerService.createOrUpdateProfile({
        skill: formData.skill,
        experience: parseInt(formData.experience),
        location: formData.location,
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a' // Default placeholder photo
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/worker-dashboard');
      }, 1500);
    } catch (err) {
      setError('Failed to save profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '20px 0' }} className="animate-fade-in">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <UserCheck size={28} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Setup Worker Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Advertise your skills to nearby customers</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)', fontSize: '0.875rem', marginBottom: '20px' }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Professional Skill
            </label>
            <select
              name="skill"
              className="form-input form-select"
              value={formData.skill}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="ELECTRICIAN">Electrician</option>
              <option value="PLUMBER">Plumber</option>
              <option value="CARPENTER">Carpenter</option>
              <option value="MECHANIC">Mechanic</option>
              <option value="PAINTER">Painter</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="experience"
              className="form-input"
              placeholder="e.g. 5"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Service Area / Location
            </label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Gajuwaka"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Camera size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              name="photoUrl"
              className="form-input"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={formData.photoUrl}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-accent btn-block" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Saving Profile...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
