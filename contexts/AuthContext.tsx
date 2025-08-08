'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  userRole: 'guest' | 'staff' | 'admin' | null
  login: (username: string, password: string) => boolean
  logout: () => void
  checkAccess: (requiredRole: 'staff' | 'admin') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'guest' | 'staff' | 'admin' | null>(null)

  // Credenciais simples (em produção, usar autenticação real)
  const credentials = {
    'admin': { password: 'admin123', role: 'admin' as const },
    'chef': { password: 'chef123', role: 'admin' as const },
    'garcom': { password: 'staff123', role: 'staff' as const },
    'funcionario': { password: 'func123', role: 'staff' as const }
  }

  useEffect(() => {
    // Verificar se há sessão salva
    const savedAuth = localStorage.getItem('tropiqual_auth')
    if (savedAuth) {
      const { role, timestamp } = JSON.parse(savedAuth)
      // Sessão expira em 8 horas
      if (Date.now() - timestamp < 8 * 60 * 60 * 1000) {
        setIsAuthenticated(true)
        setUserRole(role)
      } else {
        localStorage.removeItem('tropiqual_auth')
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const user = credentials[username as keyof typeof credentials]
    if (user && user.password === password) {
      setIsAuthenticated(true)
      setUserRole(user.role)
      
      // Salvar sessão
      localStorage.setItem('tropiqual_auth', JSON.stringify({
        role: user.role,
        timestamp: Date.now()
      }))
      
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    localStorage.removeItem('tropiqual_auth')
  }

  const checkAccess = (requiredRole: 'staff' | 'admin'): boolean => {
    if (!isAuthenticated || !userRole) return false
    
    if (requiredRole === 'admin') {
      return userRole === 'admin'
    }
    
    if (requiredRole === 'staff') {
      return userRole === 'staff' || userRole === 'admin'
    }
    
    return false
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      login,
      logout,
      checkAccess
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
