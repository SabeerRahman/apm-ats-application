import apiClient from '../api'
import { API_BASE_URL, ENDPOINTS } from '../constants'

export const parseResumes = async (jdFile, resumeFiles, onUploadProgress) => {
  const formData = new FormData()
  formData.append('jd_file', jdFile)
  resumeFiles.forEach((file) => formData.append('resumes', file))

  const response = await apiClient.post(ENDPOINTS.PARSE_RESUMES, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        onUploadProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  })

  return response.data
}

export const downloadResume = (fileName, originalName) => {
  const url = `${API_BASE_URL}${ENDPOINTS.DOWNLOAD}/${encodeURIComponent(fileName)}`
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', originalName || fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
