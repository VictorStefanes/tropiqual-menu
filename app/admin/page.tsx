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
}

interface Recommendation {
  id: string
  menuItemName: string
  customName?: string
  useCustomName: boolean
  customDescription?: string
  useCustomDescription: boolean
  customPrice?: string
  useCustomPrice: boolean
  badges: string[]
  specialIngredients: string[]
  available: boolean
  featured: boolean
  originalMenuItem: MenuItem
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

  const badgeOptions = ['Chef\'s Choice', 'Premium', 'Seasonal', 'Signature', 'Fusion']

  useEffect(() => {
    loadData()
    loadMenuItems()
  }, [])

  const loadMenuItems = () => {
    // Importar los items del menú desde el componente principal
    const menuData = {
      entradas: [
        {
          name: "Gyoza de Pato",
          description: "Deliciosos dumplings artesanales rellenos de pato confitado, servidos con nuestra exclusiva salsa ponzu casera y un toque de aceite de sésamo tostado",
          ingredients: ["Pato confitado", "Masa de gyoza", "Cebollino", "Jengibre", "Salsa ponzu", "Aceite de sésamo"],
          price: "14€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
          category: "entradas"
        },
        {
          name: "Tataki de Atún",
          description: "Atún rojo de calidad sashimi, sellado a la perfección con una costra aromática de sésamo negro, acompañado de salsa teriyaki y microgreens frescos",
          ingredients: ["Atún rojo", "Sésamo negro", "Salsa teriyaki", "Microgreens", "Wasabi", "Jengibre encurtido"],
          price: "18€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
          category: "entradas"
        },
        {
          name: "Ceviche Nikkei",
          description: "Fusión perfecta entre la tradición peruana y japonesa. Pescado fresco del día marinado en leche de tigre con ají amarillo, acompañado de batata y maíz cancha",
          ingredients: ["Pescado del día", "Leche de tigre", "Ají amarillo", "Cebolla morada", "Batata", "Maíz cancha"],
          price: "16€",
          spicy: true,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
          category: "entradas"
        },
        {
          name: "Edamame Especial",
          description: "Edamame salteado al wok con ajo dorado, guindilla fresca y sal marina de Cádiz. Un aperitivo tradicional con nuestro toque especial",
          ingredients: ["Edamame", "Ajo", "Guindilla", "Sal marina", "Aceite de oliva", "Cebollino"],
          price: "8€",
          spicy: true,
          vegetarian: true,
          image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=300&fit=crop",
          category: "entradas"
        }
      ],
      sushi: [
        {
          name: "Tropiqual Roll",
          description: "Nuestro roll insignia con salmón fresco, aguacate cremoso y pepino crujiente, coronado con salsa teriyaki casera y huevas de tobiko naranjas",
          ingredients: ["Salmón fresco", "Aguacate", "Pepino", "Arroz sushi", "Nori", "Salsa teriyaki", "Tobiko"],
          price: "15€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
          category: "sushi"
        },
        {
          name: "Dragon Roll",
          description: "Espectacular roll con anguila glaseada, pepino y aguacate, cubierto con láminas de aguacate que simulan escamas de dragón y salsa unagi",
          ingredients: ["Anguila", "Pepino", "Aguacate", "Arroz sushi", "Salsa unagi", "Sésamo", "Nori"],
          price: "17€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop",
          category: "sushi"
        },
        {
          name: "Spicy Tuna Roll",
          description: "Roll picante con atún fresco marinado en mayonesa japonesa especiada, acompañado de cebollino fresco y un toque de sriracha",
          ingredients: ["Atún rojo", "Mayonesa japonesa", "Sriracha", "Cebollino", "Arroz sushi", "Tempura flakes"],
          price: "16€",
          spicy: true,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
          category: "sushi"
        },
        {
          name: "Sashimi Selection",
          description: "Cuidadosa selección de los mejores pescados del día cortados por nuestro chef especializado. Incluye salmón, atún, lubina y pez mantequilla",
          ingredients: ["Salmón", "Atún rojo", "Lubina", "Pez mantequilla", "Wasabi", "Jengibre encurtido"],
          price: "24€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop",
          category: "sushi"
        }
      ],
      carnes: [
        {
          name: "Wagyu Beef",
          description: "Exquisito chuletón de wagyu premium cocinado a la brasa, acompañado de verduras de temporada salteadas al wok y nuestra exclusiva salsa miso dulce",
          ingredients: ["Chuletón Wagyu", "Verduras de temporada", "Salsa miso", "Setas shiitake", "Brotes de bambú", "Aceite de sésamo"],
          price: "45€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
          category: "carnes"
        },
        {
          name: "Pollo Teriyaki",
          description: "Jugoso muslo de pollo confitado lentamente, glaseado con nuestra salsa teriyaki casera y acompañado de arroz jazmín y verduras crujientes",
          ingredients: ["Muslo de pollo", "Salsa teriyaki", "Arroz jazmín", "Brócoli", "Zanahoria", "Pimiento rojo"],
          price: "19€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
          category: "carnes"
        },
        {
          name: "Costillas Nikkei",
          description: "Tiernas costillas de cerdo laqueadas con una fusión de salsa tamarindo y ají amarillo, cocinadas lentamente hasta conseguir la textura perfecta",
          ingredients: ["Costillas de cerdo", "Salsa tamarindo", "Ají amarillo", "Miel", "Salsa de soja", "Jengibre"],
          price: "22€",
          spicy: true,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
          category: "carnes"
        },
        {
          name: "Cordero Miso",
          description: "Selecta pierna de cordero marinada en miso rojo durante 24 horas, asada a la perfección y servida con puré de batata y espárragos trigueros",
          ingredients: ["Pierna de cordero", "Miso rojo", "Batata", "Espárragos", "Ajo negro", "Romero"],
          price: "28€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
          category: "carnes"
        }
      ],
      pescados: [
        {
          name: "Robalo a la Brasa",
          description: "Robalo entero fresco del día, cocinado a la brasa con técnicas tradicionales japonesas, marinado en salsa de soja y acompañado de limón yuzu",
          ingredients: ["Robalo entero", "Salsa de soja", "Limón yuzu", "Miso blanco", "Algas wakame", "Rábano daikon"],
          price: "26€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
          category: "pescados"
        },
        {
          name: "Salmón Miso",
          description: "Lomo de salmón noruego glaseado con miso blanco, cocinado a baja temperatura para mantener su jugosidad, servido sobre lecho de arroz negro",
          ingredients: ["Salmón noruego", "Miso blanco", "Arroz negro", "Edamame", "Cebollino", "Aceite de chile"],
          price: "23€",
          spicy: false,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
          category: "pescados"
        },
        {
          name: "Pulpo al Carbón",
          description: "Tentáculos de pulpo gallego tierno, cocinado al carbón y acompañado de nuestro exclusivo alioli de wasabi y papas baby confitadas",
          ingredients: ["Pulpo gallego", "Wasabi", "Alioli", "Papas baby", "Pimentón", "Aceite de oliva"],
          price: "21€",
          spicy: true,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
          category: "pescados"
        },
        {
          name: "Dorada Nikkei",
          description: "Dorada fresca al horno con verduras de temporada y nuestra característica salsa anticuchera, una fusión perfecta de sabores peruanos y japoneses",
          ingredients: ["Dorada", "Salsa anticuchera", "Verduras de temporada", "Quinoa", "Ají panca", "Cilantro"],
          price: "24€",
          spicy: true,
          vegetarian: false,
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
          category: "pescados"
        }
      ],
      cocteles: [
        {
          name: "Gin Mojito Tropiqual",
          description: "Nuestra bebida estrella con gin premium, hierbabuena fresca del huerto, lima recién exprimida y nuestro toque tropical secreto con frutas exóticas",
          ingredients: ["Gin premium", "Hierbabuena", "Lima", "Agua con gas", "Azúcar de caña", "Frutas tropicales"],
          price: "12€",
          spicy: false,
          vegetarian: true,
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
          category: "cocteles"
        },
        {
          name: "Sake Martini",
          description: "Elegante combinación de sake premium japonés con vodka de alta calidad, servido con aceitunas kalamata y un toque de yuzu para el paladar más exigente",
          ingredients: ["Sake premium", "Vodka", "Aceitunas kalamata", "Yuzu", "Vermut seco", "Hielo"],
          price: "14€",
          spicy: false,
          vegetarian: true,
          image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
          category: "cocteles"
        },
        {
          name: "Pisco Sour Nikkei",
          description: "Fusión perfecta del clásico peruano con toques japoneses, preparado con pisco acholado, clara de huevo, lima y un toque picante de ají amarillo",
          ingredients: ["Pisco acholado", "Clara de huevo", "Lima", "Ají amarillo", "Jarabe simple", "Angostura"],
          price: "11€",
          spicy: true,
          vegetarian: true,
          image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop",
          category: "cocteles"
        },
        {
          name: "Whisky Umami",
          description: "Innovador cóctel con whisky japonés, nuestro exclusivo miso caramelo casero y cítricos frescos, una experiencia sensorial única en cada sorbo",
          ingredients: ["Whisky japonés", "Miso caramelo", "Cítricos", "Hielo", "Angostura", "Piel de naranja"],
          price: "16€",
          spicy: false,
          vegetarian: true,
          image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
          category: "cocteles"
        }
      ]
    }
    setMenuItems(menuData)
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
      const jsonData = await response.json()
      setData(jsonData)
      setAdminName(jsonData.updatedBy || '')
    } catch (error) {
      console.error('Error loading data:', error)
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
      menuItemName: menuItem.name,
      useCustomName: false,
      useCustomDescription: false,
      useCustomPrice: false,
      badges: ['Chef\'s Choice'],
      specialIngredients: menuItem.ingredients.slice(0, 3),
      available: true,
      featured: true,
      originalMenuItem: menuItem
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
    return rec.useCustomName && rec.customName ? rec.customName : rec.menuItemName
  }

  const getDisplayDescription = (rec: Recommendation) => {
    return rec.useCustomDescription && rec.customDescription ? rec.customDescription : rec.originalMenuItem.description
  }

  const getDisplayPrice = (rec: Recommendation) => {
    return rec.useCustomPrice && rec.customPrice ? rec.customPrice : rec.originalMenuItem.price
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
            {data.recommendations.map((rec, index) => (
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
                      src={rec.originalMenuItem.image}
                      alt={rec.menuItemName}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDisplayName(rec)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Del menú: {rec.originalMenuItem.category}
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
                          {rec.menuItemName}
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
                          {rec.originalMenuItem.price}
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
                          {rec.originalMenuItem.description}
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
                        Ingredientes originales: {rec.originalMenuItem.ingredients.join(', ')}
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
    </div>
    </ProtectedRoute>
  )
}
