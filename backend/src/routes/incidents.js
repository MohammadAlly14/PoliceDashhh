const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabase');

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
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
