// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Admin, Coordinator, Evaluator
const Participant = require('../models/Participant'); // Participants
const router = express.Router();

// =========================
// Participant Register
// =========================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, phone, team, teamMembers } = req.body;

    if (!name || !email || !password || !college || !phone || !team) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // check if email already exists
    const existsInUsers = await User.findOne({ email });
    const existsInParticipants = await Participant.findOne({ email });
    if (existsInUsers || existsInParticipants) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const participant = new Participant({
      name,
      email,
      password: hash,
      college,
      phone,
      team,
      teamMembers,
    });

    await participant.save();
    res.json({ msg: 'Participant registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================
// Create Admin/Coordinator/Evaluator (via Postman)
// =========================
router.post('/create-user', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    if (!['admin', 'coordinator', 'evaluator'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ msg: `${role} created successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================
// Login (shared for all roles)
// =========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing email or password' });

    // check Users first (admin, coordinator, evaluator)
    let account = await User.findOne({ email });
    let role = null;

    if (account) {
      role = account.role;
    } else {
      // else check Participants
      account = await Participant.findOne({ email });
      if (account) {
        role = "participant";
      }
    }

    if (!account) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: account._id, email: account.email, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: account._id, email: account.email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
