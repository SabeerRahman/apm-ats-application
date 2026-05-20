import ScoreBadge from './ScoreBadge'
import { downloadResume } from '../../services/atsService'

const initials = (name) =>
  name === 'Unknown'
    ? '?'
    : name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

const CandidateCard = ({ candidate }) => {
  const { candidate_name, email, phone, score, file_name, original_file_name } = candidate

  return (
    <div className="candidate-card">
      <div className="cc-top">
        <div className="cc-avatar">{initials(candidate_name)}</div>
        <ScoreBadge score={score} />
      </div>

      <p className="cc-name">{candidate_name}</p>

      <div className="cc-meta">
        <div className="cc-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>{email}</span>
        </div>
        <div className="cc-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{phone}</span>
        </div>
      </div>

      <div className="cc-footer">
        <button className="btn-download" onClick={() => downloadResume(file_name, original_file_name)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default CandidateCard
