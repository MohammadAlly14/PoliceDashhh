import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { connectRealtime, formatRealtimeEvent } from '../services/realtime';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function Dashboard() {
  const [connectionState, setConnectionState] = useState('connecting');
  const [liveEvents, setLiveEvents] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    totalComplaints: 0,
    activeIncidents: 0,
    distressAlerts: 0,
    resolved: 0,
  });

  // Fetch live metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [complaintsRes, incidentsRes] = await Promise.all([
          fetch(`${API_URL}/complaints`),
          fetch(`${API_URL}/incidents`),
        ]);

        const complaints = await complaintsRes.json();
        const incidents = await incidentsRes.json();

        const distressCount = incidents.filter(i => i.is_distress === true).length;
        const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

        setLiveMetrics({
          totalComplaints: complaints.length,
          activeIncidents: incidents.filter(i => !i.is_distress).length,
          distressAlerts: distressCount,
          resolved: resolvedCount,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock data for charts (in production, fetch from API)
  const complaintStatusData = [
    { name: 'Submitted', value: 45, fill: '#8884d8' },
    { name: 'Under Review', value: 32, fill: '#82ca9d' },
    { name: 'Resolved', value: 28, fill: '#ffc658' },
    { name: 'Closed', value: 15, fill: '#ff7c7c' },
  ];

  const incidentTypeData = [
    { name: 'Use of Force', value: 23 },
    { name: 'Misconduct', value: 18 },
    { name: 'Excessive Enforcement', value: 12 },
    { name: 'Discrimination', value: 8 },
    { name: 'Officer Safety', value: 9 },
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
    { name: 'PC A', complaints: 5, incidents: 3, rating: 7.8 },
    { name: 'PC B', complaints: 2, incidents: 1, rating: 9.2 },
    { name: 'PC C', complaints: 8, incidents: 6, rating: 5.4 },
    { name: 'PC D', complaints: 3, incidents: 2, rating: 8.6 },
    { name: 'PC E', complaints: 6, incidents: 4, rating: 6.9 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B'];

  useEffect(() => {
    const socket = connectRealtime();
    const eventNames = [
      'complaint:submitted',
      'complaint:status-updated',
      'incident:created',
      'incident:flagged',
      'incident:distress',
      'incident:location-update',
      'incident:acknowledged',
    ];

    socket.on('connect', () => {
      setConnectionState('live');
    });

    socket.on('disconnect', () => {
      setConnectionState('offline');
    });

    socket.on('telemetry:welcome', () => {
      setConnectionState('live');
    });

    eventNames.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        const formattedEvent = formatRealtimeEvent(eventName, payload);

        if (!formattedEvent) {
          return;
        }

        setLiveEvents((currentEvents) => [formattedEvent, ...currentEvents].slice(0, 8));

        // Update distress count if this is a distress event
        if (eventName === 'incident:distress') {
          setLiveMetrics((prev) => ({
            ...prev,
            distressAlerts: prev.distressAlerts + 1,
          }));
        }
      });
    });

    return () => {
      eventNames.forEach((eventName) => socket.off(eventName));
      socket.disconnect();
    };
  }, []);

  const dashboardMetrics = useMemo(
    () => ({
      totalComplaints: liveMetrics.totalComplaints + liveEvents.filter((event) => event.badge === 'NEW').length,
      activeIncidents: liveMetrics.activeIncidents + liveEvents.filter((event) => event.badge === 'LIVE').length,
      distressAlerts: liveMetrics.distressAlerts,
      resolved: liveMetrics.resolved + liveEvents.filter((event) => event.title.includes('resolved')).length,
      liveEvents: liveEvents.length,
    }),
    [liveMetrics, liveEvents]
  );

  const fallbackActivity = [
    {
      id: 'seed-1',
      badge: 'NEW',
      badgeClass: 'new',
      title: 'Complaint intake channel initialized',
      detail: 'Dashboard is ready to receive live complaint submissions and status changes.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      badge: 'LIVE',
      badgeClass: 'live',
      title: 'Incident telemetry stream connected',
      detail: 'Field incident broadcasts will appear here as soon as the backend emits them.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'seed-3',
      badge: 'DISTRESS',
      badgeClass: 'alert distress-medium',
      title: 'System ready for officer safety alerts',
      detail: 'Officer distress events and location tracking enabled.',
      timestamp: new Date().toISOString(),
    },
  ];

  const activityFeed = liveEvents.length > 0 ? liveEvents : fallbackActivity;

  return (
    <div className="dashboard">
      <h2>📊 MPS Operational Dashboard</h2>
      <div className={`telemetry-banner ${connectionState}`}>
        <span className="telemetry-indicator" />
        <span>
          Real-time monitoring channel: <strong>{connectionState === 'live' ? 'connected' : connectionState}</strong>
        </span>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <h4>Total Complaints</h4>
            <p className="metric-value">{dashboardMetrics.totalComplaints}</p>
            <p className="metric-change">Public portal + intake submissions</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📹</div>
          <div className="metric-content">
            <h4>Active Incidents</h4>
            <p className="metric-value">{dashboardMetrics.activeIncidents}</p>
            <p className="metric-change">Field operational events</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h4>Resolved Cases</h4>
            <p className="metric-value">{dashboardMetrics.resolved}</p>
            <p className="metric-change">Closed investigations</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚨</div>
          <div className="metric-content">
            <h4>Officer Safety Alerts</h4>
            <p className="metric-value" style={{ color: dashboardMetrics.distressAlerts > 0 ? '#ff4444' : '#333' }}>
              {dashboardMetrics.distressAlerts}
            </p>
            <p className="metric-change">Active distress incidents</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📡</div>
          <div className="metric-content">
            <h4>Live Events</h4>
            <p className="metric-value">{dashboardMetrics.liveEvents}</p>
            <p className="metric-change">Latest telecom feed events</p>
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
          <h3>Monthly Trends - Complaints vs Incidents vs Resolved</h3>
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
          <h3>Police Constable Performance Overview</h3>
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
        <h3>📡 Live Operations Feed</h3>
        <div className="activity-list">
          {activityFeed.map((activity) => (
            <div key={activity.id} className={`activity-item ${activity.badgeClass ? (activity.badgeClass.includes('distress') ? 'distress-item' : '') : ''}`}>
              <span className={`activity-badge ${activity.badgeClass || ''}`}>{activity.badge}</span>
              <div className="activity-text">
                <p><strong>{activity.title}</strong></p>
                <p>{activity.detail}</p>
                <small>{new Date(activity.timestamp).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
