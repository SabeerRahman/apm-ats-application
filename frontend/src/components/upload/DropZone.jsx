import { useRef, useState } from 'react'

const DropZone = ({ onFilesSelected, accept, multiple = false, label, subLabel, hasFile }) => {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const stop = (e) => { e.preventDefault(); e.stopPropagation() }

  const handleDrop = (e) => {
    stop(e)
    setDragging(false)
    const files = e.dataTransfer.files
    if (files.length) onFilesSelected(files)
  }

  const handleChange = (e) => {
    if (e.target.files.length) onFilesSelected(e.target.files)
    e.target.value = ''
  }

  const zoneClass = [
    'dropzone',
    dragging ? 'dropzone--active' : '',
    hasFile  ? 'dropzone--has-file' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={zoneClass}
      onClick={() => inputRef.current.click()}
      onDragEnter={(e) => { stop(e); setDragging(true) }}
      onDragLeave={(e) => { stop(e); setDragging(false) }}
      onDragOver={stop}
      onDrop={handleDrop}
    >
      <div className="dropzone-icon">
        {hasFile ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
          </svg>
        )}
      </div>

      <p className="dropzone-label">
        {hasFile ? 'File ready' : <><span>Click to browse</span> or drag & drop</>}
      </p>
      <p className="dropzone-sub">{subLabel}</p>

      <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} />
    </div>
  )
}

export default DropZone
