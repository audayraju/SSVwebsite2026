import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { apiUrl } from '../lib/api'
import styles from './Admin.module.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Invalid credentials')
      sessionStorage.setItem('ssv_admin_token', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | SSV Jewellers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>SSV Admin</h1>
          <p className={styles.loginSub}>Sign in to manage your products</p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.field}>
              <label htmlFor="adm-user">Username</label>
              <input
                id="adm-user"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="adm-pass">Password</label>
              <input
                id="adm-pass"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className={styles.errorMsg} role="alert">{error}</p>}

            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
