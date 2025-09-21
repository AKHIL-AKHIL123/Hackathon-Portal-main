const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/auth');

router.route('/')
  .post(
    authMiddleware(['admin']),
    [
      body('title').not().isEmpty().withMessage('Title is required'),
      body('description').not().isEmpty().withMessage('Description is required'),
      body('startDate').isISO8601().toDate().withMessage('Start date is required'),
      body('endDate').isISO8601().toDate().withMessage('End date is required'),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    createHackathon
  )
  .get(getHackathons);

router.route('/:id')
  .get(getHackathonById)
  .put(authMiddleware(['admin']), updateHackathon)
  .delete(authMiddleware(['admin']), deleteHackathon);

module.exports = router;