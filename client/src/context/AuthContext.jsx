import { createContext, useState, useEffect, } from 'react'
import React from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      const parts = storedToken.split('.')
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]))
          setRole(payload.role)
        } catch {
          setRole(null)
        }
      }
    }
  }, [])

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    const parts = newToken.split('.')
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(atob(parts[1]))
        setRole(payload.role)
      } catch {
        setRole(null)
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}