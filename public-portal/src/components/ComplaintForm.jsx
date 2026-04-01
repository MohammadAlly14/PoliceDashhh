import React, { useState } from 'react';
import { complaintsApi } from '../services/api';
import './ComplaintForm.css';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_email: '',
    description: '',
    incident_date: '',
    officer_id: '',
    location: '',
    evidence_urls: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [complaintId, setComplaintId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEvidenceChange = (e) => {
    const urls = e.target.value.split('\n').filter((url) => url.trim());
    setFormData((prev) => ({ ...prev, evidence_urls: urls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.citizen_name || !formData.citizen_email || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await complaintsApi.submitComplaint(formData);
      setComplaintId(response.data.id);
      setSuccess(true);
      setFormData({
        citizen_name: '',
        citizen_email: '',
        description: '',
        incident_date: '',
        officer_id: '',
        location: '',
        evidence_urls: [],
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>📝 Submit a Complaint</h2>
      <p className="form-description">
        Share your experience and help us improve accountability. Your complaint will be reviewed by the appropriate authorities.
      </p>

      {success && (
        <div className="success-message">
          <h3>✅ Complaint Submitted Successfully!</h3>
          <p>Your complaint ID is: <strong>{complaintId}</strong></p>
          <p>You can use this ID to track your complaint status. Check back soon for updates.</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-section">
          <h3>Your Information</h3>

          <div className="form-group">
            <label htmlFor="citizen_name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="citizen_name"
              name="citizen_name"
              value={formData.citizen_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="citizen_email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="citizen_email"
              name="citizen_email"
              value={formData.citizen_email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Incident Details</h3>

          <div className="form-group">
            <label htmlFor="incident_date">Date of Incident</label>
            <input
              type="date"
              id="incident_date"
              name="incident_date"
              value={formData.incident_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Address or intersection"
            />
          </div>

          <div className="form-group">
            <label htmlFor="officer_id">Officer ID or Badge Number (if known)</label>
            <input
              type="text"
              id="officer_id"
              name="officer_id"
              value={formData.officer_id}
              onChange={handleInputChange}
              placeholder="e.g., APD-2024-001"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Your Complaint</h3>

          <div className="form-group">
            <label htmlFor="description">
              Describe What Happened <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please provide as much detail as possible about the incident..."
              rows="8"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Evidence (Optional)</h3>

          <div className="form-group">
            <label htmlFor="evidence_urls">
              Evidence Links (Photo/Video URLs - one per line)
            </label>
            <textarea
              id="evidence_urls"
              rows="4"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
              onChange={handleEvidenceChange}
            />
            <small>You can upload evidence to a cloud service and paste the links here.</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>

      <div className="privacy-notice">
        <p>
          <strong>Privacy Notice:</strong> Your information will be kept confidential and used only for complaint investigation purposes. We take your privacy seriously.
        </p>
      </div>
    </div>
  );
}
