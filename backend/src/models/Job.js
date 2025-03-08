const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  preferredSkills: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience required']
  },
  education: {
    type: String,
    required: [true, 'Please add minimum education required']
  },
  location: {
    type: String,
    required: [true, 'Please add job location']
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please add company name']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);