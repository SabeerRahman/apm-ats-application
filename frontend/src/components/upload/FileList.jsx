import { formatFileSize } from '../../utils/helpers'

const PdfIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const SingleFilePreview = ({ file, onRemove }) => (
  <div className="file-item">
    <div className="file-item-icon"><PdfIcon /></div>
    <div className="file-item-info">
      <p className="file-item-name">{file.name}</p>
      <p className="file-item-size">{formatFileSize(file.size)}</p>
    </div>
    {onRemove && (
      <button className="file-item-remove" onClick={(e) => { e.stopPropagation(); onRemove() }}>
        <XIcon />
      </button>
    )}
  </div>
)

export const JDFilePreview = ({ file, onRemove }) => (
  <div className="file-list">
    <SingleFilePreview file={file} onRemove={onRemove} />
  </div>
)

export const ResumeFileList = ({ files, onClearAll }) => {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="resume-summary">
      <div className="resume-summary-left">
        <div className="resume-summary-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div>
          <p className="resume-summary-count">
            {files.length} resume{files.length !== 1 ? 's' : ''} selected
          </p>
          <p className="resume-summary-size">{formatFileSize(totalSize)} total</p>
        </div>
      </div>
      <button className="resume-summary-clear" onClick={(e) => { e.stopPropagation(); onClearAll() }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        Clear
      </button>
    </div>
  )
}
