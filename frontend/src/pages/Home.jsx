import { useState, useEffect, useRef } from 'react'
import DropZone from '../components/upload/DropZone'
import { JDFilePreview, ResumeFileList } from '../components/upload/FileList'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import ResultsSection from '../components/results/ResultsSection'
import { useJDUpload, useResumeUpload } from '../hooks/useFileUpload'
import { parseResumes } from '../services/atsService'
import { ACCEPTED_JD_TYPES, ACCEPTED_RESUME_TYPES, FILE_LIMITS } from '../constants'
import { saveAnalysis, getAllAnalyses, deleteAnalysis } from '../utils/indexedDB'

const stripExt = (name) => name.replace(/\.[^/.]+$/, '')

const formatDate = (ts) => {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const totalCount = (results) =>
  (results?.above_80?.length || 0) +
  (results?.between_50_79?.length || 0) +
  (results?.below_50?.length || 0)

const Home = () => {
  const { jdFile, jdError, handleJDFile, clearJD }                                     = useJDUpload()
  const { resumeFiles, resumeErrors, handleResumeFiles, removeResume, clearResumes }   = useResumeUpload()

  const [loading, setLoading]               = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [results, setResults]               = useState(null)
  const [resultsPosition, setResultsPosition] = useState('')
  const [error, setError]                   = useState('')

  const [history, setHistory]               = useState([])
  const [historyOpen, setHistoryOpen]       = useState(false)

  const resultsRef = useRef(null)
  const drawerRef  = useRef(null)

  useEffect(() => {
    getAllAnalyses().then(setHistory).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (historyOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setHistoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [historyOpen])

  const canParse = jdFile && resumeFiles.length > 0 && !loading

  const handleClearAll = () => {
    clearJD()
    clearResumes()
    setResults(null)
    setResultsPosition('')
    setError('')
    setUploadProgress(null)
  }

  const handleParse = async () => {
    setError('')
    setResults(null)
    setLoading(true)
    setUploadProgress(0)

    const position = stripExt(jdFile.name)

    try {
      const data = await parseResumes(jdFile, resumeFiles, setUploadProgress)
      setResults(data)
      setResultsPosition(position)
      await saveAnalysis(position, data).catch(() => {})
      getAllAnalyses().then(setHistory).catch(() => {})
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setUploadProgress(null)
    }
  }

  const loadHistoryItem = (item) => {
    setResults(item.results)
    setResultsPosition(item.position)
    setHistoryOpen(false)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const removeHistoryItem = async (id, e) => {
    e.stopPropagation()
    await deleteAnalysis(id).catch(() => {})
    setHistory((h) => h.filter((x) => x.id !== id))
  }

  return (
    <main style={{ flex: 1 }}>
      {loading && <Loader uploadProgress={uploadProgress} />}

      {/* History FAB */}
      <button
        className="history-fab"
        onClick={() => setHistoryOpen((o) => !o)}
        title="View history"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {history.length > 0 && (
          <span className="history-fab-badge">{history.length}</span>
        )}
      </button>

      {/* History Drawer */}
      {historyOpen && (
        <div className="history-drawer-backdrop">
          <div className="history-drawer" ref={drawerRef}>
            <div className="history-drawer-header">
              <h3>Analysis History</h3>
              <button className="history-drawer-close" onClick={() => setHistoryOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p>No saved analyses yet</p>
              </div>
            ) : (
              <ul className="history-list">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="history-item"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div className="history-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="history-item-body">
                      <p className="history-item-role">{item.position}</p>
                      <p className="history-item-meta">
                        {totalCount(item.results)} candidates · {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <button
                      className="history-item-del"
                      onClick={(e) => removeHistoryItem(item.id, e)}
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="container">
        {/* Hero */}
        <div className="hero">
          <div className="hero-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            AI-Powered Resume Screening
          </div>
          <h1>
            Match the <span>Right Talent</span><br />to Every Job
          </h1>
          <p className="hero-sub">
            Upload your Job Description and up to {FILE_LIMITS.MAX_RESUMES} resumes. Claude AI scores each
            candidate instantly.
          </p>
        </div>

        {/* Upload Grid */}
        <div className="upload-grid">
          {/* JD Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="card-title-block">
                <h3>Job Description</h3>
                <p>PDF, DOCX, or TXT — single file</p>
              </div>
            </div>

            <div className="dropzone-wrap">
              <DropZone
                onFilesSelected={(files) => handleJDFile(files[0])}
                accept={ACCEPTED_JD_TYPES}
                multiple={false}
                subLabel="Supports PDF, DOCX, TXT • Max 10MB"
                hasFile={!!jdFile}
              />

              {jdFile && <JDFilePreview file={jdFile} onRemove={clearJD} />}

              {jdError && (
                <div className="error-list" style={{ marginTop: 10 }}>
                  <p>{jdError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumes Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon indigo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="card-title-block">
                <h3>Candidate Resumes</h3>
                <p>PDF only — up to {FILE_LIMITS.MAX_RESUMES} files</p>
              </div>
            </div>

            <div className="dropzone-wrap">
              <DropZone
                onFilesSelected={handleResumeFiles}
                accept={ACCEPTED_RESUME_TYPES}
                multiple={true}
                subLabel={`PDF only • Max ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB per file`}
                hasFile={resumeFiles.length > 0}
              />

              {resumeFiles.length > 0 && (
                <ResumeFileList files={resumeFiles} onClearAll={clearResumes} />
              )}

              {resumeErrors.length > 0 && (
                <div className="error-list" style={{ marginTop: 10 }}>
                  {resumeErrors.map((e, i) => <p key={i}>{e}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <Button
            variant="primary"
            onClick={handleParse}
            disabled={!canParse}
            loading={loading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Parse Resumes
          </Button>

          <Button variant="outline" onClick={handleClearAll} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Clear All
          </Button>
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="section-divider" />
            <div ref={resultsRef}>
              <ResultsSection results={results} position={resultsPosition} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Home
