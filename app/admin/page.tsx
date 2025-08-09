'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  LogOut,
  User
} from 'lucide-react'

interface MenuItem {
  name: string
  description: string
  ingredients: string[]
  price: string
  spicy: boolean
  vegetarian: boolean
  image: string
  category: string
  badges?: string[]
}

interface Recommendation {
  id: string
  name: string
  description: string
  price: string
  category: string
  image: string
  badges: string[]
  specialIngredients: string[]
  available: boolean
  featured: boolean
  demo?: boolean
  // Propriedades para customização
  useCustomName?: boolean
  customName?: string
  useCustomDescription?: boolean
  customDescription?: string
  useCustomPrice?: boolean
  customPrice?: string
}

interface RecommendationsData {
  active: boolean
  title: string
  subtitle: string
  recommendations: Recommendation[]
  lastUpdated: string
  updatedBy: string
}

export default function AdminPanel() {
  const { userRole, logout } = useAuth()
  const [data, setData] = useState<RecommendationsData | null>(null)
  const [menuItems, setMenuItems] = useState<{[key: string]: MenuItem[]}>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMenuSelector, setShowMenuSelector] = useState(false)
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    description: '',
    ingredients: [],
    price: '',
    spicy: false,
    vegetarian: false,
    image: '',
    category: 'entradas',
    badges: []
  })
  const [newIngredient, setNewIngredient] = useState('')
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [newBadge, setNewBadge] = useState('')

  const badgeOptions = ['Chef\'s Choice', 'Premium', 'Seasonal', 'Signature', 'Fusion']
  const categoryOptions = [
    { value: 'entradas', label: 'Entradas' },
    { value: 'sushi', label: 'Sushi' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'pescados', label: 'Pescados' },
    { value: 'cocteles', label: 'Cócteles' },
    { value: 'postres', label: 'Postres' }
  ]

  useEffect(() => {
    loadData()
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      } else {
        // Se a API falhar, inicializar com categorias vazias
        setMenuItems({
          entradas: [],
          sushi: [],
          carnes: [],
          pescados: [],
          cocteles: [],
          postres: []
        })
      }
    } catch (error) {
      console.error('Erro ao carregar itens do menu:', error)
      // Inicializar com categorias vazias em caso de erro
      setMenuItems({
        entradas: [],
        sushi: [],
        carnes: [],
        pescados: [],
        cocteles: [],
        postres: []
      })
    }
  }

  const getAllMenuItems = (): MenuItem[] => {
    return Object.values(menuItems).flat()
  }

  const getFilteredMenuItems = (): MenuItem[] => {
    const allItems = getAllMenuItems()
    if (!searchTerm) return allItems
    
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  const loadData = async () => {
    try {
      const response = await fetch('/api/chef-recommendations')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData = await response.json()
      setData(jsonData)
      setAdminName(jsonData.updatedBy || '')
    } catch (error) {
      console.error('Error loading data:', error)
      // Se há erro, inicializar com dados padrão
      const defaultData = {
        active: false,
        title: "Recomendaciones del Chef",
        subtitle: "Nuestras especialidades más destacadas, seleccionadas personalmente por nuestro chef ejecutivo",
        recommendations: [],
        settings: {
          maxRecommendations: 6,
          showBadges: true,
          allowCustomNames: true,
          featuredFirst: true
        },
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: "Sistema Admin"
      }
      setData(defaultData)
      setAdminName("Sistema Admin")
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    if (!data) return
    
    setSaving(true)
    try {
      const updatedData = {
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: adminName || 'Administrador'
      }
      
      const response = await fetch('/api/chef-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
      
      if (!response.ok) {
        throw new Error('Error al guardar')
      }
      
      const result = await response.json()
      console.log('Datos guardados:', result)
      
      setData(updatedData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error al guardar los cambios. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const addRecommendationFromMenu = (menuItem: MenuItem) => {
    if (!data) return
    
    const newRecommendation: Recommendation = {
      id: `menu-${Date.now()}`,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      image: menuItem.image,
      useCustomName: false,
      useCustomDescription: false,
      useCustomPrice: false,
      badges: ['Chef\'s Choice'],
      specialIngredients: menuItem.ingredients.slice(0, 3),
      available: true,
      featured: true
    }
    
    setData({
      ...data,
      recommendations: [...data.recommendations, newRecommendation]
    })
    
    setShowMenuSelector(false)
    setSearchTerm('')
  }

  const removeRecommendation = (id: string) => {
    if (!data) return
    
    setData({
      ...data,
      recommendations: data.recommendations.filter(rec => rec.id !== id)
    })
  }

  const updateRecommendation = (id: string, field: keyof Recommendation, value: any) => {
    if (!data) return
    
    setData({
      ...data,
      recommendations: data.recommendations.map(rec =>
        rec.id === id ? { ...rec, [field]: value } : rec
      )
    })
  }

  const toggleBadge = (id: string, badge: string) => {
    const recommendation = data?.recommendations.find(rec => rec.id === id)
    if (!recommendation) return
    
    const badges = recommendation.badges.includes(badge)
      ? recommendation.badges.filter(b => b !== badge)
      : [...recommendation.badges, badge]
    
    updateRecommendation(id, 'badges', badges)
  }

  const getDisplayName = (rec: Recommendation) => {
    return rec.useCustomName && rec.customName ? rec.customName : rec.name
  }

  const getDisplayDescription = (rec: Recommendation) => {
    return rec.useCustomDescription && rec.customDescription ? rec.customDescription : rec.description
  }

  const getDisplayPrice = (rec: Recommendation) => {
    return rec.useCustomPrice && rec.customPrice ? rec.customPrice : rec.price
  }

  // Funções para gerenciar novo item do menu
  const addIngredient = () => {
    if (newIngredient.trim() && !newItem.ingredients.includes(newIngredient.trim())) {
      setNewItem({
        ...newItem,
        ingredients: [...newItem.ingredients, newIngredient.trim()]
      })
      setNewIngredient('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setNewItem({
      ...newItem,
      ingredients: newItem.ingredients.filter(i => i !== ingredient)
    })
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setNewItem({...newItem, image: result})
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImageUpload = () => {
    setImageFile(null)
    setImagePreview('')
    setNewItem({...newItem, image: ''})
    // Reset do input file
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const resetNewItemForm = () => {
    setShowNewItemForm(false)
    setNewItem({
      name: '',
      description: '',
      ingredients: [],
      price: '',
      spicy: false,
      vegetarian: false,
      image: '',
      category: 'entradas',
      badges: []
    })
    setNewIngredient('')
    setImageUploadMode('url')
    setSelectedBadges([])
    setNewBadge('')
    resetImageUpload()
  }

  const addBadge = () => {
    if (newBadge.trim() && !selectedBadges.includes(newBadge.trim())) {
      const updatedBadges = [...selectedBadges, newBadge.trim()]
      setSelectedBadges(updatedBadges)
      setNewItem({...newItem, badges: updatedBadges})
      setNewBadge('')
    }
  }

  const removeBadge = (badge: string) => {
    const updatedBadges = selectedBadges.filter(b => b !== badge)
    setSelectedBadges(updatedBadges)
    setNewItem({...newItem, badges: updatedBadges})
  }

  const togglePredefinedBadge = (badge: string) => {
    let updatedBadges
    if (selectedBadges.includes(badge)) {
      updatedBadges = selectedBadges.filter(b => b !== badge)
    } else {
      updatedBadges = [...selectedBadges, badge]
    }
    setSelectedBadges(updatedBadges)
    setNewItem({...newItem, badges: updatedBadges})
  }

  const formatPrice = (value: string) => {
    // Remove tudo que não for número ou vírgula
    let cleaned = value.replace(/[^\d,]/g, '')
    
    // Se não começar com €, adiciona
    if (cleaned && !value.startsWith('€')) {
      // Se não tem vírgula, adiciona ,00
      if (!cleaned.includes(',')) {
        cleaned = cleaned + ',00'
      }
      // Se tem vírgula mas não tem centavos, adiciona zeros
      else if (cleaned.split(',')[1] === '') {
        cleaned = cleaned + '00'
      }
      // Se tem só 1 dígito após vírgula, adiciona zero
      else if (cleaned.split(',')[1].length === 1) {
        cleaned = cleaned + '0'
      }
      // Se tem mais de 2 dígitos após vírgula, mantém só 2
      else if (cleaned.split(',')[1].length > 2) {
        const parts = cleaned.split(',')
        cleaned = parts[0] + ',' + parts[1].substring(0, 2)
      }
      
      return '€' + cleaned
    }
    
    return cleaned
  }

  const handleSubmitNewItem = async () => {
    if (!newItem.name.trim() || !newItem.price.trim()) {
      alert('Nome e preço são obrigatórios')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Item adicionado:', result)
        
        // Recarregar os itens do menu
        await loadMenuItems()
        
        // Resetar formulário
        resetNewItemForm()
        
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao adicionar item')
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      alert('Erro ao adicionar item. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-600">Error al cargar los datos</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
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
                <ChefHat className="mr-3 text-primary-600" size={28} />
                Panel de Administración
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
              
              <button
                onClick={saveData}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : saved ? (
                  <>
                    <Check size={16} className="mr-2" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuración General</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Mostrar sección de recomendaciones?
              </label>
              <button
                onClick={() => setData({ ...data, active: !data.active })}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  data.active 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {data.active ? <Eye size={16} className="mr-2" /> : <EyeOff size={16} className="mr-2" />}
                {data.active ? 'Visible en el menú' : 'Oculto en el menú'}
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la sección
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Menu Administration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Administração do Menu</h2>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Adicionar Novo Item
            </button>
          </div>

          {/* Menu Categories Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryOptions.map((category) => (
              <div key={category.value} className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{category.label}</h3>
                <p className="text-2xl font-bold text-primary-600 mt-2">
                  {menuItems[category.value]?.length || 0}
                </p>
                <p className="text-sm text-gray-500">itens</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recomendaciones del Chef</h2>
            <button
              onClick={() => setShowMenuSelector(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Agregar desde Menú
            </button>
          </div>

          {/* Menu Selector Modal */}
          {showMenuSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Seleccionar Plato del Menú</h3>
                  <button
                    onClick={() => {
                      setShowMenuSelector(false)
                      setSearchTerm('')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar platos por nombre, descripción o ingredientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                  {getFilteredMenuItems().map((item, index) => (
                    <motion.div
                      key={`${item.category}-${item.name}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addRecommendationFromMenu(item)}
                    >
                      <div className="flex space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <span className="text-primary-600 font-bold">{item.price}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              {item.category}
                            </span>
                            {item.spicy && (
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                                Picante
                              </span>
                            )}
                            {item.vegetarian && (
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                Vegetariano
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {getFilteredMenuItems().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron platos que coincidan con la búsqueda
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {data?.recommendations?.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDisplayName(rec)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Categoría: {rec.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateRecommendation(rec.id, 'available', !rec.available)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {rec.available ? 'Disponible' : 'No disponible'}
                    </button>
                    
                    <button
                      onClick={() => removeRecommendation(rec.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Name & Price Customization */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nombre personalizado
                        </label>
                        <button
                          onClick={() => updateRecommendation(rec.id, 'useCustomName', !rec.useCustomName)}
                          className={`px-2 py-1 rounded text-xs ${
                            rec.useCustomName ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rec.useCustomName ? 'Personalizado' : 'Original'}
                        </button>
                      </div>
                      {rec.useCustomName ? (
                        <input
                          type="text"
                          value={rec.customName || ''}
                          onChange={(e) => updateRecommendation(rec.id, 'customName', e.target.value)}
                          placeholder="Nombre personalizado..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                          {rec.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Precio personalizado
                        </label>
                        <button
                          onClick={() => updateRecommendation(rec.id, 'useCustomPrice', !rec.useCustomPrice)}
                          className={`px-2 py-1 rounded text-xs ${
                            rec.useCustomPrice ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rec.useCustomPrice ? 'Personalizado' : 'Original'}
                        </button>
                      </div>
                      {rec.useCustomPrice ? (
                        <input
                          type="text"
                          value={rec.customPrice || ''}
                          onChange={(e) => updateRecommendation(rec.id, 'customPrice', e.target.value)}
                          placeholder="Ej: 25€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                          {rec.price}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etiquetas especiales
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {badgeOptions.map(badge => (
                          <button
                            key={badge}
                            onClick={() => toggleBadge(rec.id, badge)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              rec.badges.includes(badge)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Description & Ingredients */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Descripción personalizada
                        </label>
                        <button
                          onClick={() => updateRecommendation(rec.id, 'useCustomDescription', !rec.useCustomDescription)}
                          className={`px-2 py-1 rounded text-xs ${
                            rec.useCustomDescription ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rec.useCustomDescription ? 'Personalizada' : 'Original'}
                        </button>
                      </div>
                      {rec.useCustomDescription ? (
                        <textarea
                          value={rec.customDescription || ''}
                          onChange={(e) => updateRecommendation(rec.id, 'customDescription', e.target.value)}
                          placeholder="Descripción personalizada..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 max-h-20 overflow-y-auto">
                          {rec.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingredientes destacados (separados por coma)
                      </label>
                      <input
                        type="text"
                        value={rec.specialIngredients.join(', ')}
                        onChange={(e) => updateRecommendation(rec.id, 'specialIngredients', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="Ej: Wagyu A5, Sal negra, Miso dulce"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ingredientes actuales: {rec.specialIngredients.join(', ')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vista previa final
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {getDisplayName(rec)}
                          </h4>
                          <span className="text-primary-600 font-bold">
                            {getDisplayPrice(rec)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {getDisplayDescription(rec)}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {rec.badges.map(badge => (
                            <span key={badge} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Instrucciones de Uso
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Agregar platos:</strong> Haz clic en "Agregar Plato" para crear una nueva recomendación</p>
            <p>• <strong>Editar información:</strong> Modifica directamente los campos de texto</p>
            <p>• <strong>Cambiar disponibilidad:</strong> Usa el botón verde/rojo para mostrar u ocultar platos</p>
            <p>• <strong>Etiquetas:</strong> Haz clic en las etiquetas para activarlas o desactivarlas</p>
            <p>• <strong>Guardar:</strong> No olvides hacer clic en "Guardar Cambios" cuando termines</p>
            <p>• <strong>Vista previa:</strong> Puedes volver al menú principal para ver los cambios</p>
          </div>
        </div>
      </div>

      {/* New Item Form Modal */}
      {showNewItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Adicionar Novo Item ao Menu</h3>
              <button
                onClick={resetNewItemForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Prato *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  placeholder="Ex: Salmão Grelhado"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  placeholder="Descreva o prato, método de preparo, acompanhamentos..."
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço *
                </label>
                <input
                  type="text"
                  value={newItem.price}
                  onChange={(e) => {
                    const formattedPrice = formatPrice(e.target.value)
                    setNewItem({...newItem, price: formattedPrice})
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  placeholder="Ex: €24,90"
                />
              </div>

              {/* Ingredientes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredientes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    placeholder="Digite um ingrediente e pressione Enter"
                  />
                  <button
                    onClick={addIngredient}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newItem.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags/Badges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags do Prato
                </label>
                
                {/* Tags predefinidas */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Tags sugeridas:</p>
                  <div className="flex flex-wrap gap-2">
                    {badgeOptions.map((badge) => (
                      <button
                        key={badge}
                        onClick={() => togglePredefinedBadge(badge)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedBadges.includes(badge)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag personalizada */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addBadge()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    placeholder="Digite uma tag personalizada"
                  />
                  <button
                    onClick={addBadge}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Tags selecionadas */}
                {selectedBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedBadges.map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {badge}
                        <button
                          onClick={() => removeBadge(badge)}
                          className="ml-2 text-blue-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem do Prato
                </label>
                
                {/* Seletor de modo */}
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageMode"
                      checked={imageUploadMode === 'url'}
                      onChange={() => {
                        setImageUploadMode('url')
                        resetImageUpload()
                      }}
                      className="mr-2"
                    />
                    URL da Imagem
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageMode"
                      checked={imageUploadMode === 'upload'}
                      onChange={() => {
                        setImageUploadMode('upload')
                        setNewItem({...newItem, image: ''})
                      }}
                      className="mr-2"
                    />
                    Upload do Computador
                  </label>
                </div>

                {/* Campo baseado no modo selecionado */}
                {imageUploadMode === 'url' ? (
                  <input
                    type="text"
                    value={newItem.image}
                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        <Upload size={16} className="mr-2" />
                        Escolher Arquivo
                      </label>
                      {imageFile && (
                        <span className="text-sm text-gray-600">
                          {imageFile.name}
                        </span>
                      )}
                      {imageFile && (
                        <button
                          onClick={resetImageUpload}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    {/* Preview da imagem */}
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Preview para URL */}
                {imageUploadMode === 'url' && newItem.image && (
                  <div className="mt-3">
                    <img
                      src={newItem.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Opções */}
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.spicy}
                    onChange={(e) => setNewItem({...newItem, spicy: e.target.checked})}
                    className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                  />
                  Apimentado
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.vegetarian}
                    onChange={(e) => setNewItem({...newItem, vegetarian: e.target.checked})}
                    className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                  />
                  Vegetariano
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetNewItemForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} className="inline mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitNewItem}
                  disabled={saving || !newItem.name.trim() || !newItem.price.trim()}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Adicionando...' : (
                    <>
                      <Check size={16} className="inline mr-2" />
                      Adicionar Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
