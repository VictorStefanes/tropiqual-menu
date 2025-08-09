'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ChefHat, 
  MenuSquare, 
  Sparkles, 
  LogOut,
  User,
  ArrowRight 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface AdminDashboardProps {
  onClose?: () => void
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const router = useRouter()
  const { logout, userRole } = useAuth()

  const dashboardOptions = [
    {
      id: 'menu',
      title: 'Menu Principal',
      description: 'Gestionar platos, categorías, precios e ingredientes',
      icon: MenuSquare,
      path: '/admin',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      available: true
    },
    {
      id: 'chef',
      title: 'Recomendaciones del Chef',
      description: 'Configurar especialidades y platos destacados',
      icon: ChefHat,
      path: '/menu-admin',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      available: userRole === 'admin'
    },
    {
      id: 'ai',
      title: 'Asistente IA',
      description: 'Demostración de funciones inteligentes',
      icon: Sparkles,
      path: '/demo-ai',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      available: true
    }
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onClose) onClose()
  }

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                <p className="text-gray-600">Bienvenido al sistema administrativo</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {dashboardOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden ${
                option.available 
                  ? 'cursor-pointer hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => option.available && handleNavigation(option.path)}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                {/* Icon Header */}
                <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mb-4 ${
                  option.available ? option.hoverColor : ''
                } transition-colors`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {option.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {option.description}
                  </p>

                  {/* Action */}
                  <div className="pt-4">
                    {option.available ? (
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-medium">
                          Acceder
                        </span>
                        <ArrowRight className="w-5 h-5 text-primary-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">
                          Acceso Restringido
                        </span>
                        <div className="w-5 h-5 bg-gray-300 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                {option.available && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-50 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">Rol:</span> {userRole === 'admin' ? 'Administrador' : 'Funcionario'}
              </div>
              <div>
                <span className="font-medium text-gray-900">Acceso:</span> {userRole === 'admin' ? 'Completo' : 'Limitado'}
              </div>
              <div>
                <span className="font-medium text-gray-900">Sistema:</span> Tropiqual Menu v1.0
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
