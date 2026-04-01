import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  // Sample data for charts
  const complaintStatusData = [
    { name: 'Submitted', value: 45, fill: '#8884d8' },
    { name: 'Under Review', value: 32, fill: '#82ca9d' },
    { name: 'Resolved', value: 28, fill: '#ffc658' },
    { name: 'Closed', value: 15, fill: '#ff7c7c' },
  ];

  const incidentTypeData = [
    { name: 'Use of Force', value: 23 },
    { name: 'Misconduct', value: 18 },
    { name: 'Excessive Ticketing', value: 12 },
    { name: 'Discrimination', value: 8 },
    { name: 'Other', value: 9 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', complaints: 24, incidents: 18, resolved: 12 },
    { month: 'Feb', complaints: 28, incidents: 22, resolved: 15 },
    { month: 'Mar', complaints: 32, incidents: 26, resolved: 18 },
    { month: 'Apr', complaints: 26, incidents: 20, resolved: 14 },
    { month: 'May', complaints: 38, incidents: 30, resolved: 22 },
    { month: 'Jun', complaints: 42, incidents: 35, resolved: 28 },
  ];

  const officerPerformanceData = [
    { name: 'Officer A', complaints: 5, incidents: 3, rating: 7.8 },
    { name: 'Officer B', complaints: 2, incidents: 1, rating: 9.2 },
    { name: 'Officer C', complaints: 8, incidents: 6, rating: 5.4 },
    { name: 'Officer D', complaints: 3, incidents: 2, rating: 8.6 },
    { name: 'Officer E', complaints: 6, incidents: 4, rating: 6.9 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B'];

  return (
    <div className="dashboard">
      <h2>📊 Dashboard & Analytics</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <h4>Total Complaints</h4>
            <p className="metric-value">120</p>
            <p className="metric-change">↑ 8% this month</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📹</div>
          <div className="metric-content">
            <h4>Active Incidents</h4>
            <p className="metric-value">73</p>
            <p className="metric-change">↓ 2% from last week</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h4>Resolved</h4>
            <p className="metric-value">45</p>
            <p className="metric-change">↑ 12% resolution rate</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👮</div>
          <div className="metric-content">
            <h4>Active Officers</h4>
            <p className="metric-value">287</p>
            <p className="metric-change">5 on investigation</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        <div className="chart-container">
          <h3>Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {complaintStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Incident Types Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#82ca9d"
                dataKey="value"
              >
                {incidentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        <div className="chart-container full-width">
          <h3>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="incidents" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Officer Performance */}
      <div className="charts-row">
        <div className="chart-container full-width">
          <h3>Officer Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={officerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#ff7c7c" />
              <Bar dataKey="incidents" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>📌 Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-badge">NEW</span>
            <div className="activity-text">
              <p><strong>Complaint #1245 filed</strong> - Excessive force at Central Station</p>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-badge pending">PENDING</span>
            <div className="activity-text">
              <p><strong>Incident #856 investigation</strong> - Under administrative review</p>
              <small>5 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-badge resolved">RESOLVED</span>
            <div className="activity-text">
              <p><strong>Complaint #1240 closed</strong> - Officer misconduct investigation concluded</p>
              <small>1 day ago</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-badge">NEW</span>
            <div className="activity-text">
              <p><strong>Officer investigation initiated</strong> - Officer ID #2847</p>
              <small>2 days ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
