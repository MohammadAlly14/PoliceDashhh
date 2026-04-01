import React, { useState } from 'react';
import './UsersManagement.css';

export default function UsersManagement() {
  const [users] = useState([
    { id: 1, name: 'Officer John Smith', email: 'john@police.gov', role: 'admin', badge: 'A-001', division: 'Central', status: 'active', joinDate: '2021-03-15', rating: 8.5 },
    { id: 2, name: 'Officer Sarah Johnson', email: 'sarah.j@police.gov', role: 'officer', badge: 'A-002', division: 'North', status: 'active', joinDate: '2020-07-22', rating: 9.2 },
    { id: 3, name: 'Officer Marcus Williams', email: 'marcus.w@police.gov', role: 'officer', badge: 'A-003', division: 'South', status: 'active', joinDate: '2019-11-08', rating: 5.4 },
    { id: 4, name: 'Officer Lisa Chen', email: 'lisa.chen@police.gov', role: 'supervisor', badge: 'A-004', division: 'East', status: 'active', joinDate: '2018-05-14', rating: 8.6 },
    { id: 5, name: 'Officer David Brown', email: 'david.b@police.gov', role: 'officer', badge: 'A-005', division: 'West', status: 'training', joinDate: '2023-01-10', rating: 6.9 },
    { id: 6, name: 'Officer Amanda Rodriguez', email: 'amanda.r@police.gov', role: 'officer', badge: 'A-006', division: 'Central', status: 'active', joinDate: '2022-06-20', rating: 7.8 },
    { id: 7, name: 'Officer James Taylor', email: 'james.t@police.gov', role: 'officer', badge: 'A-007', division: 'North', status: 'investigating', joinDate: '2019-09-18', rating: 4.2 },
    { id: 8, name: 'Officer Emily Davis', email: 'emily.d@police.gov', role: 'officer', badge: 'A-008', division: 'South', status: 'active', joinDate: '2021-02-25', rating: 8.9 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.badge.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: '#ff7c7c',
      supervisor: '#ffc658',
      officer: '#8884d8',
    };
    return colors[role] || '#999';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: '#82ca9d', label: 'Active' },
      training: { color: '#ffc658', label: 'Training' },
      investigating: { color: '#ff7c7c', label: 'Under Investigation' },
      suspended: { color: '#888', label: 'Suspended' },
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="users-management">
      <h2>👮 Officers Management</h2>

      <div className="users-container">
        <div className="users-filters">
          <h3>Filters & Search</h3>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or badge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Role</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="officer">Officer</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="training">Training</option>
              <option value="investigating">Under Investigation</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="filter-stats">
            <p><strong>{filteredUsers.length}</strong> officers match filters</p>
            <p><strong>{users.filter((u) => u.status === 'active').length}</strong> active</p>
            <p><strong>{users.filter((u) => u.status === 'investigating').length}</strong> under investigation</p>
          </div>
        </div>

        <div className="users-list-container">
          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <div className="no-results">No officers match your search criteria.</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-badge">
                    <span style={{ background: getRoleColor(user.role) }}>{user.badge}</span>
                  </div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span className="role" style={{ background: getRoleColor(user.role), color: 'white' }}>
                        {user.role.toUpperCase()}
                      </span>
                      <span
                        className="status"
                        style={{ background: getStatusBadge(user.status).color, color: 'white' }}
                      >
                        {getStatusBadge(user.status).label}
                      </span>
                    </div>
                  </div>
                  <div className="user-rating">
                    <span className="rating-value">{user.rating.toFixed(1)}</span>
                    <span className="rating-stars">⭐</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedUser && (
            <div className="user-details">
              <h3>{selectedUser.name}</h3>

              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-row">
                  <span className="label">Badge Number:</span>
                  <span className="value">{selectedUser.badge}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Division:</span>
                  <span className="value">{selectedUser.division} Division</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Status & Role</h4>
                <div className="detail-row">
                  <span className="label">Role:</span>
                  <span className="value" style={{ background: getRoleColor(selectedUser.role), color: 'white', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value" style={{ background: getStatusBadge(selectedUser.status).color, color: 'white', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    {getStatusBadge(selectedUser.status).label}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Join Date:</span>
                  <span className="value">{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Performance & Rating</h4>
                <div className="detail-row">
                  <span className="label">Performance Score:</span>
                  <div className="rating-display">
                    <span className="rating-value">{selectedUser.rating.toFixed(1)}/10</span>
                    <div className="rating-bar">
                      <div className="rating-fill" style={{ width: `${(selectedUser.rating / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary">📋 View Full Record</button>
                <button className="btn btn-secondary">✏️ Edit</button>
                <button className="btn btn-secondary">📸 View Incidents</button>
                <button className="btn btn-danger">🔒 Investigate</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
