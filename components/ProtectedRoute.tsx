'use client'

import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'
import { Shield, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: 'staff' | 'admin'
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { checkAccess } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const hasAccess = checkAccess(requiredRole)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          
          <p className="text-gray-600 mb-6">
            Esta área é restrita para {requiredRole === 'admin' ? 'administradores' : 'funcionários'}.
            Faça login para continuar.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              Fazer Login
            </button>
            
            <a
              href="/"
              className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar ao Menu Principal
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              💡 <strong>Dica:</strong> Se você é funcionário do restaurante, 
              peça as credenciais ao seu supervisor.
            </p>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        requiredRole={requiredRole}
      />
    </>
  )
}
