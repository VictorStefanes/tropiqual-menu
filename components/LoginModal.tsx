'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, ChefHat } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  requiredRole?: 'staff' | 'admin'
}

export default function LoginModal({ isOpen, onClose, requiredRole = 'staff' }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  // Debug para verificar se os states estão sendo atualizados
  console.log('Login Modal - Username:', username, 'Password length:', password.length)

  // Limpar campos quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setUsername('')
      setPassword('')
      setError('')
      setShowPassword(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = login(username, password)
      if (success) {
        onClose()
        setUsername('')
        setPassword('')
        // Redirecionar para o dashboard após login bem-sucedido
        router.push('/dashboard')
      } else {
        setError('Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro no login')
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { user: 'tropiqual', pass: 'tropiqualadmin', role: 'Administrador Principal' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <ChefHat className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso {requiredRole === 'admin' ? 'Administrativo' : 'de Funcionários'}
          </h2>
          <p className="text-gray-600">
            {requiredRole === 'admin' 
              ? 'Área restrita para administradores' 
              : 'Área restrita para funcionários'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                placeholder="Digite seu usuário"
                autoComplete="username"
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Credenciais de Demonstração:</h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {demoCredentials.map((cred) => (
              <div key={cred.user} className="bg-gray-50 p-2 rounded flex justify-between">
                <span className="font-medium">{cred.role}:</span>
                <span className="text-gray-600">{cred.user} / {cred.pass}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
