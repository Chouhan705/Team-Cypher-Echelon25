const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJobStatus, 
  deleteJob 
} = require('../controllers/jobController');
const { protect, recruiterOnly } = require('../middleware/authMiddleware');

// Get all jobs (both recruiters and handlers)
router.get('/', protect, getJobs);

// Get specific job (both recruiters and handlers)
router.get('/:id', protect, getJobById);

// Create job (recruiters only)
router.post('/', protect, recruiterOnly, createJob);

// Update job status (recruiters only)
router.put('/:id', protect, recruiterOnly, updateJobStatus);

// Delete job (recruiters only)
router.delete('/:id', protect, recruiterOnly, deleteJob);

module.exports = router;