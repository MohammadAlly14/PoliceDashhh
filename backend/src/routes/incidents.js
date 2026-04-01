const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabase');
const { emitRealtimeEvent } = require('../realtime');

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const { officer_id, start_date, end_date, location } = req.query;

    let query = supabase.from('incidents').select('*');

    if (officer_id) query = query.eq('officer_id', officer_id);
    if (location) query = query.eq('location', location);
    if (start_date && end_date) {
      query = query.gte('incident_date', start_date).lte('incident_date', end_date);
    }

    const { data, error } = await query.order('incident_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get incident by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create incident
router.post('/', async (req, res) => {
  try {
    const { officer_id, location, description, footage_url } = req.body;
    const id = uuidv4();

    const { data, error } = await supabase
      .from('incidents')
      .insert([
        {
          id,
          officer_id,
          location,
          description,
          footage_url,
          incident_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    emitRealtimeEvent('incident:created', {
      incidentId: data[0].id,
      officerId: data[0].officer_id,
      location: data[0].location,
      incidentDate: data[0].incident_date,
    });
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Flag incident
router.patch('/:id/flag', async (req, res) => {
  try {
    const { flagged_reason } = req.body;

    const { data, error } = await supabase
      .from('incidents')
      .update({ is_flagged: true, flagged_reason, flagged_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    emitRealtimeEvent('incident:flagged', {
      incidentId: data[0].id,
      flaggedReason: data[0].flagged_reason,
      flaggedAt: data[0].flagged_at,
    });
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create distress incident (officer safety feature)
router.post('/distress', async (req, res) => {
  try {
    const { officer_id, location, latitude, longitude, distress_level, description } = req.body;
    const id = uuidv4();

    if (!officer_id || !distress_level) {
      return res.status(400).json({ error: 'officer_id and distress_level are required' });
    }

    const { data, error } = await supabase
      .from('incidents')
      .insert([
        {
          id,
          officer_id,
          location,
          description: description || `Officer Distress Alert (${distress_level})`,
          officer_location_lat: latitude,
          officer_location_lng: longitude,
          distress_level,
          is_distress: true,
          incident_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    emitRealtimeEvent('incident:distress', {
      incidentId: data[0].id,
      officerId: data[0].officer_id,
      location: data[0].location,
      distressLevel: data[0].distress_level,
      latitude: data[0].officer_location_lat,
      longitude: data[0].officer_location_lng,
      incidentDate: data[0].incident_date,
      message: `Officer in ${distress_level} distress at ${location}`,
    });

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update officer location (for tracking distress incidents)
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude, location } = req.body;

    const { data, error } = await supabase
      .from('incidents')
      .update({
        officer_location_lat: latitude,
        officer_location_lng: longitude,
        location: location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    emitRealtimeEvent('incident:location-update', {
      incidentId: data[0].id,
      latitude: data[0].officer_location_lat,
      longitude: data[0].officer_location_lng,
      location: data[0].location,
      updatedAt: data[0].updated_at,
    });

    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Acknowledge distress incident (command response)
router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const { responding_unit, acknowledged_by } = req.body;

    const { data, error } = await supabase
      .from('incidents')
      .update({
        emergency_ack_at: new Date().toISOString(),
        emergency_ack_by: acknowledged_by,
        responding_unit: responding_unit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    emitRealtimeEvent('incident:acknowledged', {
      incidentId: data[0].id,
      respondingUnit: data[0].responding_unit,
      acknowledgedAt: data[0].emergency_ack_at,
      acknowledgedBy: data[0].emergency_ack_by,
    });

    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
