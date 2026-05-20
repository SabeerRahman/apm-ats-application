import ScoreBadge from './ScoreBadge'
import { downloadResume } from '../../services/atsService'

const CandidateTable = ({ candidates }) => {
  if (!candidates.length) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p>No candidates match the selected filter</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="candidates-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Candidate Name</th>
            <th>Email Address</th>
            <th>Contact Number</th>
            <th>ATS Score</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={`${c.file_name}-${i}`}>
              <td style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</td>
              <td className="td-name">{c.candidate_name}</td>
              <td className="td-email">{c.email}</td>
              <td className="td-phone">{c.phone}</td>
              <td><ScoreBadge score={c.score} /></td>
              <td>
                <button
                  className="btn-download"
                  onClick={() => downloadResume(c.file_name, c.original_file_name)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CandidateTable
