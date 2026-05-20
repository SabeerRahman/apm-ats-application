import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Navbar from './components/layout/Navbar'

const Home = lazy(() => import('./pages/Home'))

const SECURITY_KEY = '2356'

const SecurityOverlay = ({ onUnlock }) => {
  const [value, setValue] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => {
    if (value === SECURITY_KEY) {
      sessionStorage.setItem('ats-unlocked', 'true')
      onUnlock()
    } else {
      setError(true)
      setValue('')
      setTimeout(() => setError(false), 2000)
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter') submit() }

  return (
    <div className="security-overlay">
      <div className="security-box">
        <div className="security-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="security-company">APM Connect</p>
        <h2 className="security-title">ATS Resume Parser</h2>
        <p className="security-sub">Enter your security key to continue</p>

        <div className="security-input-wrap">
          <input
            ref={inputRef}
            type={showKey ? 'text' : 'password'}
            className={`security-input${error ? ' security-input--error' : ''}`}
            placeholder="Security key"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            maxLength={20}
          />
          <button
            className="security-eye"
            onClick={() => setShowKey((s) => !s)}
            tabIndex={-1}
            aria-label={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && <p className="security-error">Wrong</p>}

        <button className="security-btn" onClick={submit}>
          Unlock
        </button>
      </div>
    </div>
  )
}

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ats-theme') || 'dark')
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('ats-unlocked') === 'true')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ats-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  if (!unlocked) return <SecurityOverlay onUnlock={() => setUnlocked(true)} />

  return (
    <div className="app-wrapper">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="loader-ring" style={{ width: 40, height: 40 }} />
          </div>
        }
      >
        <Home />
      </Suspense>

      <footer className="app-footer">
        <div className="container">
          © {new Date().getFullYear()} APM Connect · ATS Resume Parser
        </div>
      </footer>
    </div>
  )
}

export default App
