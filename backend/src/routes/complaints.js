const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const supabase = require('../utils/supabase');
const { emitRealtimeEvent } = require('../realtime');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 5,
  },
});

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
    emitRealtimeEvent('complaint:submitted', {
      complaintId: data[0].id,
      status: data[0].status,
      location: data[0].location,
      incidentDate: data[0].incident_date,
    });
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload complaint evidence files
router.post('/evidence', upload.array('evidence', 5), async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ error: 'No evidence files were uploaded' });
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `evidence/${Date.now()}-${uuidv4()}-${safeName}`;

        const { error } = await supabase.storage.from('complaint-evidence').upload(filePath, file.buffer, {
          cacheControl: '3600',
          contentType: file.mimetype,
          upsert: false,
        });

        if (error) {
          throw error;
        }

        const { data } = supabase.storage.from('complaint-evidence').getPublicUrl(filePath);
        return data.publicUrl;
      })
    );

    return res.status(201).json({ urls: uploadResults });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
    emitRealtimeEvent('complaint:status-updated', {
      complaintId: data[0].id,
      status: data[0].status,
      findings: data[0].findings,
    });
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
