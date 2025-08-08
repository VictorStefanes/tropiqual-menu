'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoginModal from '../../components/LoginModal'
import { 
  Shield, 
  ChefHat, 
  Users, 
  Utensils, 
  Settings,
  ArrowLeft,
  Lock,
  User
} from 'lucide-react'

export default function StaffAccess() {
  const { isAuthenticated, userRole, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(!isAuthenticated)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (!isAuthenticated || showLogin) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Área de Funcionários
            </h1>
            
            <p className="text-gray-600 mb-8">
              Acesso restrito para funcionários e administradores do restaurante Tropiqual.
            </p>
            
            <button
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mb-4"
            >
              <Lock className="w-5 h-5 mr-2" />
              Fazer Login
            </button>
            
            <a
              href="/"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Voltar ao Menu
            </a>
          </div>
        </div>

        <LoginModal
          isOpen={showLogin}
          onClose={() => {
            setShowLogin(false)
            if (!isAuthenticated) {
              router.push('/')
            }
          }}
          requiredRole="staff"
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a 
                href="/"
                className="flex items-center text-gray-600 hover:text-primary-600 mr-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Menu Principal
              </a>
              <h1 className="text-xl font-bold text-gray-900">
                Painel de Funcionários
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User size={16} />
                <span>Logado como: <strong>{userRole}</strong></span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Sair"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo, {userRole === 'admin' ? 'Administrador' : 'Funcionário'}!
          </h2>
          <p className="text-gray-600">
            Escolha uma das opções abaixo para gerenciar o restaurante.
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu Management */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
            onClick={() => handleNavigation('/menu-admin')}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Administrador de Cardápio
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Adicionar, editar e gerenciar pratos do menu. Controlar preços, ingredientes e disponibilidade.
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              Acessar Cardápio
              <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </div>
          </motion.div>

          {/* Chef Recommendations - Admin Only */}
          {userRole === 'admin' && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => handleNavigation('/admin')}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recomendações do Chef
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Configurar pratos especiais e recomendações que aparecem em destaque no menu.
              </p>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                Gerenciar Recomendações
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </div>
            </motion.div>
          )}

          {/* AI Demo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
            onClick={() => handleNavigation('/demo-ai')}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Demonstração de IA
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Testar e demonstrar as funcionalidades de inteligência artificial do sistema.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              Ver Demonstração
              <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📋 Instruções Importantes
          </h3>
          <div className="space-y-3 text-blue-800">
            <p>
              • <strong>Administrador de Cardápio:</strong> Use para adicionar novos pratos, editar informações e gerenciar preços
            </p>
            {userRole === 'admin' && (
              <p>
                • <strong>Recomendações do Chef:</strong> Configure pratos especiais que aparecerão em destaque no menu público
              </p>
            )}
            <p>
              • <strong>Demonstração de IA:</strong> Teste as funcionalidades de IA para geração de descrições e preços
            </p>
            <p>
              • <strong>Logout:</strong> Sempre faça logout ao terminar o trabalho para manter a segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
