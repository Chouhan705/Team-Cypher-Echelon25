const express = require('express');
const router = express.Router();
const { 
  uploadResume, 
  getResumesByJob, 
  updateResumeRanking, 
  exportFinalList,
  upload
} = require('../controllers/resumeController');
const { protect, recruiterOnly } = require('../middleware/authMiddleware');

// Upload a resume (both recruiters and handlers)
router.post('/', protect, upload.single('resume'), uploadResume);

// Get all resumes for a job (both recruiters and handlers)
router.get('/job/:jobId', protect, getResumesByJob);

// Update resume ranking (recruiters only)
router.put('/:id/rank', protect, recruiterOnly, updateResumeRanking);

// Export final list (recruiters only)
router.get('/job/:jobId/export', protect, recruiterOnly, exportFinalList);

module.exports = router;