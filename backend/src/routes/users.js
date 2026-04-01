const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabase');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, badge_number, department, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create user (admin)
router.post('/', async (req, res) => {
  try {
    const { name, email, role, badge_number, department } = req.body;
    const id = uuidv4();

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id,
          name,
          email,
          role, // 'officer' or 'admin'
          badge_number,
          department,
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

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const { name, email, role, badge_number, department } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ name, email, role, badge_number, department })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
