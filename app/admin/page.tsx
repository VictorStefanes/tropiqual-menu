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
  id?: string
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
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | null>(null)

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
      const emptyCategories = {
        entradas: [],
        sushi: [],
        carnes: [],
        pescados: [],
        cocteles: [],
        postres: []
      }
      if (response.ok) {
        const data = await response.json()
        // Garante que todas as categorias existam, mesmo se a API não retornar todas
        const merged = { ...emptyCategories, ...data }
        setMenuItems(merged)
      } else {
        setMenuItems(emptyCategories)
      }
    } catch (error) {
      console.error('Erro ao carregar itens do menu:', error)
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
    console.log('[saveData] Botão Guardar Cambios clicado');
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
        throw new Error('Erro ao salvar')
      }
      // Após salvar, recarrega os dados do Supabase para garantir que os IDs estejam corretos
      await loadData()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      alert('Erro ao salvar as mudanças. Tente novamente.')
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
    setEditingItem(null)
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
    if (editingItem) {
      await updateMenuItem()
    } else {
      await addNewItem()
    }
  }

  const addNewItem = async () => {
    if (!newItem.name.trim() || !newItem.price.trim()) {
      alert('Nome e preço são obrigatórios')
      return
    }
    try {
      setSaving(true)
      let imageUrl = newItem.image
      if (imageFile) {
        const reader = new FileReader()
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(imageFile)
        })
      }
      // Formatar preço para euro com 2 casas decimais
      let priceNum = newItem.price.replace(/[^\d,]/g, '').replace(',', '.')
      let priceFloat = parseFloat(priceNum)
      let formattedPrice = isNaN(priceFloat) ? '€0,00' : `€${priceFloat.toFixed(2).replace('.', ',')}`
      const itemToAdd = {
        ...newItem,
        price: formattedPrice,
        image: imageUrl,
        badges: selectedBadges
      }
      console.log('Enviando item para API:', itemToAdd)
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemToAdd),
      })
      let responseBody
      try {
        responseBody = await response.clone().json()
      } catch (e) {
        responseBody = await response.text()
      }
      console.log('Resposta da API:', response.status, responseBody)
      if (response.ok) {
        await loadMenuItems()
        resetNewItemForm()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Erro ao adicionar item: ' + (responseBody.error || JSON.stringify(responseBody)))
      }
    } catch (error) {
      console.error('Erro ao adicionar item (catch):', error)
      alert('Erro ao adicionar item. Detalhes no console.')
    } finally {
      setSaving(false)
    }
  }

  const deleteMenuItem = async (item: MenuItem) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${item.name}"?`)) {
      return
    }
    try {
      setSaving(true)
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: item.id,
          category: item.category,
          name: item.name 
        }),
      })
      if (response.ok) {
        await loadMenuItems()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar item')
      }
    } catch (error) {
      console.error('Error al eliminar item:', error)
      alert('Error al eliminar item. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const editMenuItem = (item: MenuItem) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      description: item.description,
      ingredients: [...item.ingredients],
      price: item.price,
      spicy: item.spicy,
      vegetarian: item.vegetarian,
      image: item.image,
      category: item.category,
      badges: item.badges || []
    })
    setSelectedBadges(item.badges || [])
    setImagePreview(item.image)
    setShowNewItemForm(true)
  }

  const updateMenuItem = async () => {
    if (!editingItem || !newItem.name.trim() || !newItem.price.trim()) {
      alert('Por favor, completa todos los campos obrigatórios')
      return
    }
    try {
      setSaving(true)
      let imageUrl = newItem.image
      if (imageFile) {
        const reader = new FileReader()
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(imageFile)
        })
      }
      // Formatar preço para euro com 2 casas decimais
      let priceNum = newItem.price.replace(/[^\d,]/g, '').replace(',', '.')
      let priceFloat = parseFloat(priceNum)
      let formattedPrice = isNaN(priceFloat) ? '€0,00' : `€${priceFloat.toFixed(2).replace('.', ',')}`
      const updatedItem = {
        ...newItem,
        price: formattedPrice,
        image: imageUrl,
        badges: selectedBadges
      }
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldItem: editingItem,
          newItem: { ...updatedItem, id: editingItem.id }
        }),
      })
      if (response.ok) {
        await loadMenuItems()
        setEditingItem(null)
        resetNewItemForm()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || 'Error ao atualizar item')
      }
    } catch (error) {
      console.error('Error ao atualizar item:', error)
      alert('Error ao atualizar item. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const deleteRecommendation = (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta recomendación?')) {
      return
    }

    if (data) {
      const updatedRecommendations = data.recommendations.filter(rec => rec.id !== id)
      setData({
        ...data,
        recommendations: updatedRecommendations,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminName || 'Admin'
      })
    }
  }

  const editRecommendation = (recommendation: Recommendation) => {
    setEditingRecommendation(recommendation)
  }

  const saveEditedRecommendation = (updatedRec: Recommendation) => {
    if (data && editingRecommendation) {
      const updatedRecommendations = data.recommendations.map(rec =>
        rec.id === editingRecommendation.id ? updatedRec : rec
      )
      setData({
        ...data,
        recommendations: updatedRecommendations,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminName || 'Admin'
      })
      setEditingRecommendation(null)
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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

          {/* Menu Items Management */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Itens do Menu</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {getAllMenuItems().map((item, index) => (
                <motion.div
                  key={`${item.category}-${item.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                        <span className="text-primary-600 font-bold text-sm ml-2">{item.price}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {categoryOptions.find(cat => cat.value === item.category)?.label}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              editMenuItem(item)
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteMenuItem(item)
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {getAllMenuItems().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay elementos en el menú. Agrega algunos usando el botón "Adicionar Novo Item".
              </div>
            )}
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
                      onClick={() => deleteRecommendation(rec.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar recomendação"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingItem ? 'Editar Item do Menu' : 'Adicionar Novo Item ao Menu'}
              </h3>
              <button
                onClick={resetNewItemForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-8 items-start">
              {/* Nome */}
              {/* Coluna 1: Dados principais */}
              <div className="space-y-4">
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
                <label htmlFor="menu-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço *
                </label>
                <input
                  id="menu-price"
                  name="menu-price"
                  type="text"
                  inputMode="decimal"
                  pattern="^€?\d{1,3}(\.\d{3})*(,\d{2})?$"
                  aria-label="Preço em euros"
                  value={newItem.price}
                  onChange={(e) => {
                    // Permite apenas números e vírgula
                    let val = e.target.value.replace(/[^\d,]/g, '')
                    setNewItem({ ...newItem, price: val })
                  }}
                  onBlur={(e) => {
                    // Formata para euro ao sair do campo
                    let val = e.target.value.replace(/[^\d,]/g, '').replace(',', '.')
                    let num = parseFloat(val)
                    let formatted = (!isNaN(num) && num > 0) ? `€${num.toFixed(2).replace('.', ',')}` : ''
                    setNewItem({ ...newItem, price: formatted })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  placeholder="Ex: €24,90"
                  autoComplete="off"
                  required
                />
                <span className="text-xs text-gray-500 mt-1 block" id="price-help">Digite apenas números, o valor será formatado automaticamente.</span>
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
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedBadges.includes(badge) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm font-medium text-gray-700 mb-1">Opções do Prato:</span>
                <div className="flex flex-row gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newItem.spicy}
                      onChange={(e) => setNewItem({...newItem, spicy: e.target.checked})}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Apimentado 🌶️</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newItem.vegetarian}
                      onChange={(e) => setNewItem({...newItem, vegetarian: e.target.checked})}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Vegetariano 🥦</span>
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-row justify-end gap-3 pt-6 w-full md:col-span-2">
                <button
                  type="button"
                  onClick={resetNewItemForm}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <X size={16} className="inline mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmitNewItem}
                  disabled={saving || !newItem.name.trim() || !newItem.price.trim()}
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium flex items-center"
                >
                  {saving ? (editingItem ? 'Atualizando...' : 'Adicionando...') : (
                    <>
                      <Check size={16} className="inline mr-2" />
                      {editingItem ? 'Atualizar Item' : 'Adicionar Item'}
                    </>
                  )}
                </button>
              </div>

              {/* Coluna 2: Prévia visual do prato */}
              <div className="bg-white dark:bg-dark-950 rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-0 flex flex-col justify-between min-h-[420px]">
                {/* Imagem e badges */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={imagePreview || newItem.image || 'https://placehold.co/400x300?text=Prato'} 
                    alt={newItem.name || 'Prato'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {(selectedBadges.length > 0 ? selectedBadges : newItem.badges || []).map((badge, badgeIndex) => (
                      <span 
                        key={badgeIndex}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center bg-primary-100 text-primary-700`}
                      >
                        {/* Ícone opcional para badges */}
                        <span className="mr-1">🏷️</span>
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary-600 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
                      {newItem.price || '€0,00'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold font-heading">{newItem.name || 'Nome do Prato'}</h3>
                    <p className="text-sm opacity-90 capitalize">{categoryOptions.find(cat => cat.value === newItem.category)?.label || 'Categoria'}</p>
                  </div>
                </div>
                {/* Conteúdo */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed min-h-[48px]">
                    {newItem.description || 'Descrição do prato...'}
                  </p>
                  {/* Ingredientes */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Ingredientes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(newItem.ingredients.length > 0 ? newItem.ingredients : ['Exemplo 1', 'Exemplo 2']).map((ingredient, idx) => (
                        <span 
                          key={idx}
                          className="bg-primary-100 dark:bg-dark-800 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Tags/Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedBadges.map((badge, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
