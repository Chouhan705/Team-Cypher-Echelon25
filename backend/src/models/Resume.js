const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Please add candidate name']
  },
  candidateEmail: {
    type: String,
    required: [true, 'Please add candidate email']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add resume file URL']
  },
  fileName: {
    type: String,
    required: [true, 'Please add original file name']
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: [true, 'Please specify file type']
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parsedContent: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    default: 0
  },
  education: {
    type: String,
    default: ''
  },
  aiRanking: {
    score: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['must-interview', 'can-interview', 'maybe-interview', 'reject'],
      default: 'maybe-interview'
    },
    matchDetails: {
      type: Object,
      default: {}
    }
  },
  recruiterRanking: {
    category: {
      type: String,
      enum: ['must-interview', 'can-interview', 'maybe-interview', 'reject', ''],
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);