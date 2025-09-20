const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/auth');

router.route('/')
  .post(authMiddleware(['admin']), createHackathon)
  .get(getHackathons);

router.route('/:id')
  .get(getHackathonById)
  .put(authMiddleware(['admin']), updateHackathon)
  .delete(authMiddleware(['admin']), deleteHackathon);

module.exports = router;