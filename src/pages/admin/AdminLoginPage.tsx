import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Change123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  return (
    <main className="page-shell admin-login-page">
      <section className="auth-card">
        <p className="eyebrow">管理者ログイン</p>
        <h1>管理者ログイン</h1>
        <p className="lead lead--small">
          管理者ホーム、予約一覧、予約不可日登録に入るにはログインが必要です。
        </p>

        <form
          className="booking-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setIsSubmitting(true)

            try {
              await login(username, password)
              navigate(from, { replace: true })
            } catch (loginError) {
              setError(loginError instanceof Error ? loginError.message : 'ログインに失敗しました')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <label>
            <span>管理者ID</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            <span>パスワード</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </section>
    </main>
  )
}
