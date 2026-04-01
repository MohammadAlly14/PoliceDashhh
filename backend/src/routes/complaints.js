const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabase');

// Get all complaints (public - limited info)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('id, status, created_at, incident_date')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get complaint by ID with full details (if public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create complaint (citizen submission)
router.post('/', async (req, res) => {
  try {
    const { citizen_name, citizen_email, description, incident_date, officer_id, location, evidence_urls } = req.body;
    const id = uuidv4();

    const { data, error } = await supabase
      .from('complaints')
      .insert([
        {
          id,
          citizen_name,
          citizen_email,
          description,
          incident_date,
          officer_id,
          location,
          evidence_urls: evidence_urls || [],
          status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get complaint status by complaint ID
router.get('/:id/status', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('id, status, updated_at, findings')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update complaint status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, findings } = req.body;

    const { data, error } = await supabase
      .from('complaints')
      .update({ status, findings, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
