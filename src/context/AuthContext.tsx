import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../lib/api'

type AuthContextValue = {
  loading: boolean
  isAuthenticated: boolean
  username: string | null
  refresh: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  const refresh = async () => {
    try {
      const result = await api.getAdminMe()
      setIsAuthenticated(result.authenticated)
      setUsername(result.username)
    } catch {
      setIsAuthenticated(false)
      setUsername(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void api
      .getAdminMe()
      .then((result) => {
        setIsAuthenticated(result.authenticated)
        setUsername(result.username)
      })
      .catch(() => {
        setIsAuthenticated(false)
        setUsername(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      isAuthenticated,
      username,
      refresh,
      login: async (loginUsername, password) => {
        await api.adminLogin({ username: loginUsername, password })
        await refresh()
      },
      logout: async () => {
        await api.adminLogout()
        await refresh()
      },
    }),
    [isAuthenticated, loading, username]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
