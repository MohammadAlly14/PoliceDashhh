const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // In production, use Supabase Auth
    // For now, simple validation
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token (in production, use JWT properly)
    const token = Buffer.from(`${data.id}:${Date.now()}`).toString('base64');

    res.json({
      token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
