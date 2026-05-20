export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const ENDPOINTS = {
  PARSE_RESUMES: '/parse-resumes',
  DOWNLOAD: '/download',
  HEALTH: '/health',
}

export const SCORE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Candidates' },
  { value: 'above_80', label: '80–100 (Strong Match)' },
  { value: 'between_50_79', label: '50–79 (Moderate Match)' },
  { value: 'below_50', label: 'Below 50 (Weak Match)' },
]

export const SCORE_CATEGORY_KEYS = ['above_80', 'between_50_79', 'below_50']

export const SCORE_LABELS = {
  above_80: 'Strong Match',
  between_50_79: 'Moderate Match',
  below_50: 'Weak Match',
}

export const FILE_LIMITS = {
  MAX_RESUMES: 50,
  MAX_FILE_SIZE_MB: 10,
}

export const ACCEPTED_JD_TYPES = '.pdf,.docx,.txt'
export const ACCEPTED_RESUME_TYPES = '.pdf'
