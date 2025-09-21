const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const { validate, projectValidations } = require('../middleware/validation');

router.route('/')
  .post(
    authMiddleware(['admin', 'coordinator']), 
    validate(projectValidations.create),
    createProject
  )
  .get(getProjects);

module.exports = router;