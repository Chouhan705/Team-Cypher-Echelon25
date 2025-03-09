// Configuration for the application
// This allows easy switching between environments

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/token`,
  REGISTER: `${API_BASE_URL}/register`,

  // Jobs
  JOB_POSITIONS: `${API_BASE_URL}/api/job-positions`,
  JOB_POSITION: (id: string | number) => `${API_BASE_URL}/api/job-positions/${id}`,

  // Candidates
  CANDIDATES: `${API_BASE_URL}/api/candidates`,
  CANDIDATE: (id: string | number) => `${API_BASE_URL}/api/candidates/${id}`,

  // Resume processing
  PARSE_RESUME: `${API_BASE_URL}/api/parse-resume`,
  GENERATE_PROFILE: `${API_BASE_URL}/api/generate-standard-profile`,
  RANK_RESUME: `${API_BASE_URL}/api/rank-resume`,
  UPLOAD_RESUME: `${API_BASE_URL}/api/upload-resume`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
}

// Request timeout in milliseconds
export const API_TIMEOUT = 5000

// Feature flags
export const FEATURES = {
  // Enable mock data fallback when API is unavailable
  ENABLE_MOCK_FALLBACK: true,

  // Enable development mode features
  DEV_MODE: process.env.NODE_ENV === "development",
}

