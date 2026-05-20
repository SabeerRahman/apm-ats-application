const Loader = ({ uploadProgress }) => (
  <div className="loader-overlay">
    <div className="loader-box">
      <div className="loader-ring" />

      <div className="loader-dots">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>

      <p className="loader-title">Analyzing Resumes</p>
      <p className="loader-msg">
        Please wait while Claude AI evaluates each candidate against the job
        description. This may take a few minutes.
      </p>

      {uploadProgress !== null && uploadProgress < 100 && (
        <div className="loader-progress" style={{ marginTop: 20 }}>
          <div
            className="loader-progress-bar"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  </div>
)

export default Loader
