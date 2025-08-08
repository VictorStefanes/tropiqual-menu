'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import MenuItemModal from '../../components/MenuItemModal'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload,
  ChefHat,
  ArrowLeft,
  Check,
  X,
  Search,
  Camera,
  DollarSign,
  Tag,
  FileText,
  Utensils,
  Flame,
  Leaf,
  Sparkles,
  LogOut,
  User
} from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  ingredients: string[]
  price: string
  spicy: boolean
  vegetarian: boolean
  image: string
  category: string
  available: boolean
  featured: boolean
  allergens: string[]
  preparationTime: string
  calories?: string
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  cost: string
  margin: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface MenuData {
  entradas: MenuItem[]
  sushi: MenuItem[]
  carnes: MenuItem[]
  pescados: MenuItem[]
  cocteles: MenuItem[]
  postres: MenuItem[]
}

export default function MenuAdmin() {
  const { userRole, logout } = useAuth()
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [activeCategory, setActiveCategory] = useState<keyof MenuData>('entradas')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAIHelper, setShowAIHelper] = useState(false)

  const categories = [
    { id: 'entradas', name: 'Entradas', icon: '🥗' },
    { id: 'sushi', name: 'Sushi & Sashimi', icon: '🍣' },
    { id: 'carnes', name: 'Carnes', icon: '🥩' },
    { id: 'pescados', name: 'Pescados', icon: '🐟' },
    { id: 'cocteles', name: 'Cócteles', icon: '🍸' }
  ]

  const allergenOptions = ['Gluten', 'Lácteos', 'Huevos', 'Pescado', 'Mariscos', 'Frutos secos', 'Soja', 'Sésamo']
  const tagOptions = ['Nuevo', 'Popular', 'Especial', 'Temporada', 'Vegano', 'Sin gluten', 'Picante', 'Frío', 'Caliente']

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      const response = await fetch('/api/menu')
      if (!response.ok) {
        throw new Error('Error al cargar menu')
      }
      const data = await response.json()
      setMenuData(data)
      setAdminName('Admin')
    } catch (error) {
      console.error('Error loading menu data:', error)
      // Fallback para dados vazios se API falhar
      const emptyData: MenuData = {
        entradas: [],
        sushi: [],
        carnes: [],
        pescados: [],
        cocteles: [],
        postres: []
      }
      setMenuData(emptyData)
    } finally {
      setLoading(false)
    }
  }

  const createNewItem = (): MenuItem => {
    return {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      ingredients: [],
      price: '0€',
      spicy: false,
      vegetarian: false,
      image: '',
      category: activeCategory,
      available: true,
      featured: false,
      allergens: [],
      preparationTime: '0 min',
      calories: '',
      difficulty: 'Fácil',
      cost: '0€',
      margin: '0%',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: adminName || 'Admin'
    }
  }

  const saveMenuItem = async (item: MenuItem) => {
    if (!menuData) return

    const updatedItem = {
      ...item,
      updatedAt: new Date().toISOString().split('T')[0]
    }

    const updatedMenuData = { ...menuData }
    const categoryItems = updatedMenuData[activeCategory]
    
    const existingIndex = categoryItems.findIndex(i => i.id === item.id)
    if (existingIndex !== -1) {
      categoryItems[existingIndex] = updatedItem
    } else {
      categoryItems.push(updatedItem)
    }

    setMenuData(updatedMenuData)
    
    // Salvar na API
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMenuData)
      })
      
      if (!response.ok) {
        throw new Error('Error al guardar')
      }
      
      console.log('Menu guardado exitosamente')
    } catch (error) {
      console.error('Error al guardar menu:', error)
    }
    
    setEditingItem(null)
    setShowAddModal(false)
  }

  const deleteMenuItem = async (id: string) => {
    if (!menuData) return
    
    const updatedMenuData = { ...menuData }
    updatedMenuData[activeCategory] = updatedMenuData[activeCategory].filter(item => item.id !== id)
    setMenuData(updatedMenuData)
    
    // Salvar na API
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMenuData)
      })
      
      if (!response.ok) {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      console.error('Error al guardar menu:', error)
    }
  }

  const generateDescription = async (itemName: string, ingredients: string[]) => {
    // Simulação de IA para gerar descrições
    const templates = [
      `Exquisito ${itemName.toLowerCase()} preparado con ${ingredients.slice(0, 2).join(' y ')}, una experiencia culinaria única que combina sabores tradicionales con técnicas modernas.`,
      `Delicioso ${itemName.toLowerCase()} elaborado artesanalmente con ${ingredients.slice(0, 3).join(', ')}, perfecto para los paladares más exigentes.`,
      `Nuestro ${itemName.toLowerCase()} especial, cuidadosamente preparado con ${ingredients.slice(0, 2).join(' y ')}, representa la fusión perfecta de la cocina japonesa y peruana.`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }

  const calculateMargin = (price: string, cost: string) => {
    const priceNum = parseFloat(price.replace('€', ''))
    const costNum = parseFloat(cost.replace('€', ''))
    if (priceNum > 0 && costNum > 0) {
      return Math.round(((priceNum - costNum) / priceNum) * 100) + '%'
    }
    return '0%'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Cargando administrador de menú...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="staff">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a 
                href="/"
                className="flex items-center text-gray-600 hover:text-primary-600 mr-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver al Menú
              </a>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Utensils className="mr-3 text-primary-600" size={28} />
                Administrador de Menú
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
                <LogOut size={16} className="mr-1" />
                Sair
              </button>
              
              <input
                type="text"
                placeholder="Tu nombre"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <Link 
                href="/demo-ai"
                className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <Sparkles size={16} className="mr-1" />
                Demo IA
              </Link>
              
              <button
                onClick={() => setShowAIHelper(!showAIHelper)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showAIHelper ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                🤖 AI Helper
              </button>
              
              <button
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Guardar Todo
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as keyof MenuData)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeCategory === category.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {menuData?.[category.id as keyof MenuData]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar platos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => {
              setEditingItem(createNewItem())
              setShowAddModal(true)
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ml-4"
          >
            <Plus size={16} className="mr-2" />
            Nuevo Plato
          </button>
        </div>

        {/* AI Helper Panel */}
        {showAIHelper && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🤖 Asistente IA para Menús</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">📝 Generar Descripción</h4>
                <p className="text-sm text-blue-600">Crea descripciones atractivas basadas en ingredientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💰 Calcular Precios</h4>
                <p className="text-sm text-blue-600">Sugiere precios basados en costos y margen objetivo</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🏷️ Sugerir Tags</h4>
                <p className="text-sm text-blue-600">Recomienda tags y categorías automáticamente</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {menuData?.[activeCategory]?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Camera className="text-gray-400" size={32} />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.spicy && <span className="bg-red-500 text-white p-1 rounded-full"><Flame size={12} /></span>}
                  {item.vegetarian && <span className="bg-green-500 text-white p-1 rounded-full"><Leaf size={12} /></span>}
                </div>
                
                <div className="absolute bottom-2 right-2">
                  <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {item.name || 'Nuevo plato'}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-gray-500 hover:text-primary-600"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {item.description || 'Sin descripción'}
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>⏱️ {item.preparationTime}</span>
                  <span>💰 Margen: {item.margin}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {menuData?.[activeCategory]?.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay platos en {categories.find(c => c.id === activeCategory)?.name}
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primer plato a esta categoría
            </p>
            <button
              onClick={() => {
                setEditingItem(createNewItem())
                setShowAddModal(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Agregar Primer Plato
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <MenuItemModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveMenuItem}
          allergenOptions={allergenOptions}
          tagOptions={tagOptions}
        />
      )}
    </div>
    </ProtectedRoute>
  )
}
