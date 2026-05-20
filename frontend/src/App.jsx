import { lazy, Suspense, useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'

const Home = lazy(() => import('./pages/Home'))

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ats-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ats-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

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
