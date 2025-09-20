const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/admin/dashboard', authMiddleware(['admin']), (req, res) => {
  res.json({ msg: `Hello Admin ${req.user.email}`, secret: 'admin-data' });
});

router.get('/coordinator/dashboard', authMiddleware(['coordinator']), (req, res) => {
  res.json({ msg: `Hello Coordinator ${req.user.email}` });
});

router.get('/participant/dashboard', authMiddleware(['participant']), (req, res) => {
  res.json({ msg: `Hello Participant ${req.user.email}` });
});

router.get('/evaluator/dashboard', authMiddleware(['evaluator']), (req, res) => {
  res.json({ msg: `Hello Evaluator ${req.user.email}` });
});

module.exports = router;
