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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file is too large. Please select an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; // Resize to 300px width/height for fast loading
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG base64 with 70% quality to compress it to ~10-20KB
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({
            ...prev,
            photoUrl: compressedBase64
          }));
        };
      };
      reader.readAsDataURL(file);
    }
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
              Profile Photo
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={24} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
                <label 
                  htmlFor="photo-upload" 
                  className="btn btn-secondary" 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    display: 'inline-block',
                    margin: 0
                  }}
                >
                  Choose from Gallery
                </label>
                {formData.photoUrl && (
                  <button 
                    type="button" 
                    style={{ 
                      marginLeft: '12px', 
                      color: 'var(--danger)', 
                      fontSize: '0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
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
