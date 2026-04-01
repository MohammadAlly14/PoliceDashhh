import React, { useState } from 'react';
import { complaintsApi } from '../services/api';
import './ComplaintForm.css';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_email: '',
    citizen_phone: '',
    description: '',
    incident_date: '',
    location: '',
    complaint_against_type: 'police_officer',
    accused_name: '',
    accused_role: '',
    accused_identifier: '',
    evidence_urls: [],
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [complaintId, setComplaintId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEvidenceFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      setError('You can upload up to 5 evidence files per complaint');
      setEvidenceFiles(files.slice(0, 5));
      return;
    }

    setError('');
    setEvidenceFiles(files);
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
      let uploadedEvidenceUrls = [];

      if (evidenceFiles.length > 0) {
        const uploadResponse = await complaintsApi.uploadEvidence(evidenceFiles);
        uploadedEvidenceUrls = uploadResponse.data?.urls || [];
      }

      const accusedContext = [
        `Complaint against type: ${formData.complaint_against_type.replace('_', ' ')}`,
        formData.accused_name ? `Accused name: ${formData.accused_name}` : null,
        formData.accused_role ? `Accused role/title: ${formData.accused_role}` : null,
        formData.accused_identifier ? `Badge/ID/identifier: ${formData.accused_identifier}` : null,
        formData.citizen_phone ? `Complainant phone: ${formData.citizen_phone}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const payload = {
        citizen_name: formData.citizen_name,
        citizen_email: formData.citizen_email,
        incident_date: formData.incident_date || null,
        location: formData.location,
        officer_id: null,
        evidence_urls: uploadedEvidenceUrls,
        description: `${formData.description.trim()}\n\n--- Intake Context ---\n${accusedContext}`,
      };

      const response = await complaintsApi.submitComplaint(payload);
      setComplaintId(response.data.id);
      setSuccess(true);
      setFormData({
        citizen_name: '',
        citizen_email: '',
        citizen_phone: '',
        description: '',
        incident_date: '',
        location: '',
        complaint_against_type: 'police_officer',
        accused_name: '',
        accused_role: '',
        accused_identifier: '',
        evidence_urls: [],
      });
      setEvidenceFiles([]);

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
      <h2>File a Public Complaint</h2>
      <p className="form-description">
        Report incidents involving any person, including police officers. You can attach supporting evidence for investigators.
      </p>

      {success && (
        <div className="success-message">
          <h3>Complaint Submitted Successfully</h3>
          <p>Your complaint ID is: <strong>{complaintId}</strong></p>
          <p>Use this ID to track your case status from the tracking page.</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-section">
          <h3>Complainant Details</h3>

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

          <div className="form-group">
            <label htmlFor="citizen_phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="citizen_phone"
              name="citizen_phone"
              value={formData.citizen_phone}
              onChange={handleInputChange}
              placeholder="+1 (000) 000-0000"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Who Is This Complaint Against?</h3>

          <div className="form-group">
            <label htmlFor="complaint_against_type">
              Complaint Target <span className="required">*</span>
            </label>
            <select
              id="complaint_against_type"
              name="complaint_against_type"
              value={formData.complaint_against_type}
              onChange={handleInputChange}
              required
            >
              <option value="police_officer">Police officer</option>
              <option value="civilian">Civilian</option>
              <option value="government_employee">Government employee</option>
              <option value="private_individual">Private individual</option>
              <option value="organization">Organization or group</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accused_name">Accused Person/Organization Name</label>
            <input
              type="text"
              id="accused_name"
              name="accused_name"
              value={formData.accused_name}
              onChange={handleInputChange}
              placeholder="Name of person or organization"
            />
          </div>

          <div className="form-group">
            <label htmlFor="accused_role">Role/Title (if known)</label>
            <input
              type="text"
              id="accused_role"
              name="accused_role"
              value={formData.accused_role}
              onChange={handleInputChange}
              placeholder="Officer, supervisor, employee, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="accused_identifier">Badge Number, Employee ID, or Other Identifier</label>
            <input
              type="text"
              id="accused_identifier"
              name="accused_identifier"
              value={formData.accused_identifier}
              onChange={handleInputChange}
              placeholder="Any identifying information"
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
          <h3>Attach Proof (Optional)</h3>

          <div className="form-group">
            <label htmlFor="evidence_files">Upload photos, videos, or documents</label>
            <input
              id="evidence_files"
              type="file"
              onChange={handleEvidenceFileChange}
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
            <small>Accepted formats: images, videos, PDF, DOC, DOCX, TXT. Max total 5 files.</small>
            {evidenceFiles.length > 0 && (
              <div className="selected-files">
                {evidenceFiles.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="selected-file-item">
                    <span>{file.name}</span>
                    <span>{Math.round(file.size / 1024)} KB</span>
                  </div>
                ))}
              </div>
            )}
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
          <strong>Privacy Notice:</strong> Your submission is confidential and reviewed by authorized accountability staff only.
        </p>
      </div>
    </div>
  );
}
