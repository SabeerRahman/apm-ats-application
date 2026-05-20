import { FILE_LIMITS } from '../constants'

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export const getFileExtension = (name) =>
  name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()

export const validateJDFile = (file) => {
  const ext = getFileExtension(file.name)
  if (!['pdf', 'docx', 'txt'].includes(ext))
    return { valid: false, error: 'JD must be a PDF, DOCX, or TXT file' }
  if (file.size > FILE_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024)
    return { valid: false, error: `File must be under ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB` }
  return { valid: true }
}

export const validateResumeFile = (file) => {
  const ext = getFileExtension(file.name)
  if (ext !== 'pdf') return { valid: false, error: `${file.name}: only PDF resumes are accepted` }
  if (file.size > FILE_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024)
    return { valid: false, error: `${file.name}: must be under ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB` }
  return { valid: true }
}

export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export const getScoreClass = (score) => {
  if (score >= 80) return 'score-high'
  if (score >= 50) return 'score-mid'
  return 'score-low'
}

export const getAllCandidates = (results) => {
  if (!results) return []
  return [
    ...(results.above_80 || []),
    ...(results.between_50_79 || []),
    ...(results.below_50 || []),
  ]
}

export const filterCandidates = (results, filter, search) => {
  let candidates = []

  if (filter === 'all' || !filter) {
    candidates = getAllCandidates(results)
  } else {
    candidates = results?.[filter] || []
  }

  if (!search.trim()) return candidates

  const q = search.toLowerCase()
  return candidates.filter(
    (c) =>
      c.candidate_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
  )
}
