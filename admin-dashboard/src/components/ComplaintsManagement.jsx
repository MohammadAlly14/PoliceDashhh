import React, { useState } from 'react';
import './ComplaintsManagement.css';

export default function ComplaintsManagement() {
  const [complaints] = useState([
    { id: 1245, citizen: 'James Mitchell', email: 'james.m@email.com', date: '2024-03-28', officer: 'Officer A', badge: 'A-001', description: 'Excessive force at Central Station', location: 'Central Station', status: 'submitted', rating: 2 },
    { id: 1244, citizen: 'Maria Rodriguez', email: 'maria.r@email.com', date: '2024-03-27', officer: 'Officer C', badge: 'A-003', description: 'Unprofessional language during traffic stop', location: 'Broadway & 5th', status: 'under_review', rating: 3 },
    { id: 1243, citizen: 'David Chen', email: 'david.c@email.com', date: '2024-03-26', officer: 'Officer B', badge: 'A-002', description: 'Slow response to emergency call', location: 'North District', status: 'under_review', rating: 4 },
    { id: 1242, citizen: 'Sarah Williams', email: 'sarah.w@email.com', date: '2024-03-25', officer: 'Officer D', badge: 'A-004', description: 'Alleged discrimination during arrest', location: 'South Precinct', status: 'resolved', rating: 2 },
    { id: 1241, citizen: 'Michael Johnson', email: 'michael.j@email.com', date: '2024-03-24', officer: 'Officer E', badge: 'A-005', description: 'Multiple citations for minor infractions', location: 'Downtown', status: 'under_review', rating: 3 },
    { id: 1240, citizen: 'Emma Davis', email: 'emma.d@email.com', date: '2024-03-23', officer: 'Officer C', badge: 'A-003', description: 'Harassment and intimidation', location: 'School Zone', status: 'closed', rating: 1 },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [investigation, setInvestigation] = useState('');

  const filteredComplaints = complaints.filter(
    (complaint) => filterStatus === 'all' || complaint.status === filterStatus
  );

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdatedStatus(complaint.status);
    setInvestigation('');
  };

  const handleUpdateStatus = () => {
    if (selectedComplaint) {
      alert(`Updated complaint #${selectedComplaint.id} status to ${updatedStatus}`);
      setSelectedComplaint(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#8884d8',
      under_review: '#ffc658',
      resolved: '#82ca9d',
      closed: '#bbb',
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      submitted: '📥 Submitted',
      under_review: '🔍 Under Review',
      resolved: '✅ Resolved',
      closed: '⚫ Closed',
    };
    return labels[status] || status;
  };

  return (
    <div className="complaints-management">
      <h2>📋 Complaint Management</h2>

      <div className="complaints-container">
        <div className="complaints-filters">
          <h3>Filters & Search</h3>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-stats">
            <p><strong>{filteredComplaints.length}</strong> complaints</p>
            <p><strong>{complaints.filter((c) => c.status === 'submitted').length}</strong> new</p>
            <p><strong>{complaints.filter((c) => c.status === 'under_review').length}</strong> under review</p>
            <p><strong>{complaints.filter((c) => c.status === 'resolved').length}</strong> resolved</p>
          </div>
        </div>

        <div className="complaints-content">
          <div className="complaints-list">
            {filteredComplaints.length === 0 ? (
              <div className="no-results">No complaints found.</div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`complaint-card ${selectedComplaint?.id === complaint.id ? 'selected' : ''}`}
                  onClick={() => handleSelectComplaint(complaint)}
                >
                  <div className="complaint-header">
                    <div className="complaint-info">
                      <h4>Complaint #{complaint.id}</h4>
                      <p className="citizen-name">{complaint.citizen}</p>
                      <p className="complaint-date">{new Date(complaint.date).toLocaleDateString()}</p>
                    </div>
                    <span className="status-badge" style={{ background: getStatusColor(complaint.status) }}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                  <p className="complaint-description">{complaint.description}</p>
                  <div className="complaint-meta">
                    <span><strong>Officer:</strong> {complaint.officer}</span>
                    <span><strong>Location:</strong> {complaint.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedComplaint && (
            <div className="complaint-details">
              <h3>Complaint #{selectedComplaint.id}</h3>

              <div className="detail-section">
                <h4>Complainant Information</h4>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedComplaint.citizen}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedComplaint.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date Submitted:</span>
                  <span className="value">{new Date(selectedComplaint.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Incident Details</h4>
                <div className="detail-row">
                  <span className="label">Officer:</span>
                  <span className="value">{selectedComplaint.officer} ({selectedComplaint.badge})</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{selectedComplaint.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Rating:</span>
                  <span className="value">{'⭐'.repeat(selectedComplaint.rating)}{'☆'.repeat(5 - selectedComplaint.rating)}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Complaint Description</h4>
                <p className="description-text">{selectedComplaint.description}</p>
              </div>

              <div className="detail-section">
                <h4>Update Status</h4>
                <div className="form-group">
                  <label>New Status</label>
                  <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Investigation Findings / Notes</label>
                  <textarea
                    value={investigation}
                    onChange={(e) => setInvestigation(e.target.value)}
                    placeholder="Document your investigation findings here..."
                    rows="5"
                  ></textarea>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary" onClick={handleUpdateStatus}>
                  💾 Update Status
                </button>
                <button className="btn btn-secondary">📋 View Full File</button>
                <button className="btn btn-secondary">📎 Attach Documents</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
