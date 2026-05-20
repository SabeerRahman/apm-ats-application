import { useState } from 'react'
import CandidateTable from './CandidateTable'
import CandidateCard from './CandidateCard'
import SearchInput from '../common/SearchInput'
import { SCORE_FILTER_OPTIONS } from '../../constants'
import { filterCandidates } from '../../utils/helpers'
import { exportToPDF, exportToExcel } from '../../utils/exportUtils'

const StatCard = ({ count, label, colorClass, emoji }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>{emoji}</div>
    <div className="stat-info">
      <p className={`stat-count ${colorClass}`}>{count}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
)

const ResultsSection = ({ results }) => {
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  const candidates = filterCandidates(results, filter, search)

  const total = (results.above_80?.length || 0) +
                (results.between_50_79?.length || 0) +
                (results.below_50?.length || 0)

  return (
    <section className="results-section">
      <div className="results-header">
        <div>
          <h2 className="results-title">
            Analysis Results &nbsp;
            <span>{total} Candidate{total !== 1 ? 's' : ''}</span>
          </h2>
          {results.total_failed > 0 && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-warning)', marginTop: 4 }}>
              ⚠ {results.total_failed} resume{results.total_failed !== 1 ? 's' : ''} could not be processed
            </p>
          )}
        </div>
        <div className="export-buttons">
          <button
            className="btn-export btn-export-pdf"
            onClick={() => exportToPDF(candidates)}
            disabled={candidates.length === 0}
            title="Export as PDF"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Export PDF
          </button>
          <button
            className="btn-export btn-export-excel"
            onClick={() => exportToExcel(candidates)}
            disabled={candidates.length === 0}
            title="Export as Excel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard count={results.above_80?.length || 0}      label="Strong Match (80–100)"     colorClass="green"  emoji="🟢" />
        <StatCard count={results.between_50_79?.length || 0} label="Moderate Match (50–79)"    colorClass="yellow" emoji="🟡" />
        <StatCard count={results.below_50?.length || 0}      label="Weak Match (Below 50)"     colorClass="red"    emoji="🔴" />
      </div>

      <div className="controls-bar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or phone..."
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {SCORE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="desktop-only">
        <CandidateTable candidates={candidates} />
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="mobile-only">
        {candidates.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>No candidates match the selected filter</p>
          </div>
        ) : (
          <div className="cards-grid">
            {candidates.map((c, i) => (
              <CandidateCard key={`${c.file_name}-${i}`} candidate={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ResultsSection
