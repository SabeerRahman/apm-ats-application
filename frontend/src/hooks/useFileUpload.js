import { useCallback, useState } from 'react'
import { FILE_LIMITS } from '../constants'
import { validateJDFile, validateResumeFile } from '../utils/helpers'

export const useJDUpload = () => {
  const [jdFile, setJdFile] = useState(null)
  const [jdError, setJdError] = useState('')

  const handleJDFile = useCallback((file) => {
    setJdError('')
    if (!file) return
    const { valid, error } = validateJDFile(file)
    if (!valid) { setJdError(error); return }
    setJdFile(file)
  }, [])

  const clearJD = useCallback(() => { setJdFile(null); setJdError('') }, [])

  return { jdFile, jdError, handleJDFile, clearJD }
}

export const useResumeUpload = () => {
  const [resumeFiles, setResumeFiles] = useState([])
  const [resumeErrors, setResumeErrors] = useState([])

  const handleResumeFiles = useCallback((files) => {
    setResumeErrors([])
    const incoming = Array.from(files)

    const errors = []
    const valid = []
    incoming.forEach((f) => {
      const result = validateResumeFile(f)
      if (!result.valid) errors.push(result.error)
      else valid.push(f)
    })

    if (errors.length) setResumeErrors(errors)

    setResumeFiles((prev) => {
      // Deduplicate by name+size so dragging the same file twice doesn't double-add
      const existingKeys = new Set(prev.map((f) => `${f.name}-${f.size}`))
      const newFiles = valid.filter((f) => !existingKeys.has(`${f.name}-${f.size}`))
      const merged = [...prev, ...newFiles]

      if (merged.length > FILE_LIMITS.MAX_RESUMES) {
        setResumeErrors([`Maximum ${FILE_LIMITS.MAX_RESUMES} resumes allowed. Only the first ${FILE_LIMITS.MAX_RESUMES} were kept.`])
        return merged.slice(0, FILE_LIMITS.MAX_RESUMES)
      }
      return merged
    })
  }, [])

  const removeResume = useCallback(
    (index) => setResumeFiles((prev) => prev.filter((_, i) => i !== index)),
    []
  )

  const clearResumes = useCallback(() => { setResumeFiles([]); setResumeErrors([]) }, [])

  return { resumeFiles, resumeErrors, handleResumeFiles, removeResume, clearResumes }
}
