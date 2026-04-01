import React, { useState } from 'react';
import { complaintsApi } from '../services/api';
import './ComplaintTracking.css';

export default function ComplaintTracking() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setComplaint(null);

    if (!complaintId.trim()) {
      setError('Please enter a Complaint ID');
      return;
    }

    try {
      setLoading(true);
      const response = await complaintsApi.getComplaintStatus(complaintId);
      setComplaint(response.data);
    } catch (err) {
      setError('Complaint not found. Please check your Complaint ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = {
      submitted: 1,
      under_review: 2,
      resolved: 3,
      closed: 4,
    };
    return steps[status] || 0;
  };

  const currentStep = complaint ? getStatusStep(complaint.status) : 0;

  return (
    <div className="complaint-tracking-container">
      <h2>🔍 Track Your Complaint</h2>
      <p className="tracking-description">
        Enter your Complaint ID to check the status of your complaint and view any findings.
      </p>

      <form onSubmit={handleSearch} className="tracking-form">
        <div className="search-group">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter your Complaint ID"
            className="search-input"
          />
          <button type="submit" disabled={loading} className="btn-search">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {complaint && (
        <div className="complaint-status">
          <h3>Complaint Status</h3>

          <div className="status-timeline">
            <div className={`timeline-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="timeline-dot">1</div>
              <div className="timeline-label">Submitted</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 2 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="timeline-dot">2</div>
              <div className="timeline-label">Under Review</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 3 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="timeline-dot">3</div>
              <div className="timeline-label">Resolved</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 4 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="timeline-dot">4</div>
              <div className="timeline-label">Closed</div>
            </div>
          </div>

          <div className="status-details">
            <div className="detail-row">
              <span className="label">Complaint ID:</span>
              <span className="value">{complaint.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Current Status:</span>
              <span className={`value status-badge ${complaint.status}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Last Updated:</span>
              <span className="value">{new Date(complaint.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {complaint.findings && (
            <div className="findings-section">
              <h4>Investigation Findings</h4>
              <div className="findings-content">{complaint.findings}</div>
            </div>
          )}

          <div className="info-box">
            <p>
              <strong>Need Help?</strong> If you have questions about your complaint, please contact the Police Accountability Office at accountability@detroitpd.org
            </p>
          </div>
        </div>
      )}

      {!complaint && !error && (
        <div className="placeholder">
          <p>Enter your Complaint ID above to view the status and any investigation findings.</p>
        </div>
      )}
    </div>
  );
}
