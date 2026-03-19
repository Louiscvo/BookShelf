import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      // Vérifier que le token est toujours valide
      auth.me().then(res => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      }).catch(() => {
        logout()
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await auth.login(email, password)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (email, username, password) => {
    const res = await auth.register(email, username, password)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
