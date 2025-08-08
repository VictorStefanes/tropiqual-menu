'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  MapPin, 
  Clock, 
  Phone, 
  ChefHat, 
  Leaf, 
  Flame, 
  UtensilsCrossed,
  Fish,
  Beef,
  Wine,
  Sparkles,
  Coffee,
  Utensils
} from 'lucide-react'
import { useTheme } from './providers'
import RestaurantStats from '../components/RestaurantStats'
import ChefRecommendations from '../components/ChefRecommendationsNew'

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [activeCategory, setActiveCategory] = useState('entradas')
  const [menuItems, setMenuItems] = useState<any>({
    entradas: [],
    sushi: [],
    carnes: [],
    pescados: [],
    cocteles: [],
    postres: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      console.error('Error loading menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { 
      id: 'entradas', 
      name: 'Entradas', 
      icon: 'utensils'
    },
    { 
      id: 'sushi', 
      name: 'Sushi & Sashimi', 
      icon: 'sushi'
    },
    { 
      id: 'carnes', 
      name: 'Carnes a la Brasa', 
      icon: 'grill'
    },
    { 
      id: 'pescados', 
      name: 'Pescados', 
      icon: 'fish'
    },
    { 
      id: 'cocteles', 
      name: 'Cócteles', 
      icon: 'cocktail'
    }
  ]

  const renderCategoryIcon = (iconType: string, size: number = 32) => {
    switch (iconType) {
      case 'utensils':
        return <UtensilsCrossed size={size} />
      case 'sushi':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 12C2 9.79 3.79 8 6 8H18C20.21 8 22 9.79 22 12V16C22 18.21 20.21 20 18 20H6C3.79 20 2 18.21 2 16V12Z" />
            <circle cx="7" cy="12" r="1.5" fill="white" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <circle cx="17" cy="12" r="1.5" fill="white" />
          </svg>
        )
      case 'grill':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17H21L19 19H5L3 17Z" />
            <path d="M4 15H20V16H4V15Z" />
            <path d="M6 6L8 13H16L18 6H6Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="10" cy="9" r="1" />
            <circle cx="14" cy="11" r="1" />
          </svg>
        )
      case 'fish':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 12C6.5 9 9 7 12 7S17.5 9 17.5 12S15 17 12 17S6.5 15 6.5 12Z" />
            <path d="M17.5 12L21 10V14L17.5 12Z" />
            <circle cx="14" cy="11" r="1" fill="white" />
          </svg>
        )
      case 'cocktail':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 7L12 14L19 7H5Z" />
            <line x1="12" y1="14" x2="12" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        )
      default:
        return <UtensilsCrossed size={size} />
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md border-b border-primary-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-2xl font-heading font-bold text-primary-600 dark:text-primary-400">
                TROPIQUAL
              </div>
              <div className="text-sm text-dark-600 dark:text-dark-400 font-medium">
                SUSHI & GRILL
              </div>
            </motion.div>

            {/* Desktop Navigation - Removed categories */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Categories removed from header */}
            </nav>

            {/* Theme Toggle Only */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-dark-700 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 dark:from-primary-800 dark:via-primary-700 dark:to-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">
                Bienvenido a
              </h1>
              <div className="text-6xl md:text-8xl font-heading font-bold text-white mb-6 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                TROPIQUAL
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Fish className="mr-2" size={20} />
                <span className="text-white font-semibold">Fusión</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Beef className="mr-2" size={20} />
                <span className="text-white font-semibold">Steak House</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Wine className="mr-2" size={20} />
                <span className="text-white font-semibold">Cócteles</span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Comida japonesa con alma Nikkei, carnes y pescados a la brasa, 
              cócteles de autor, y un ligero acento occidental.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  <span>Plaza de la Encarnación, 23 - Sevilla</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  <span>18:00 - 03:00</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 opacity-20 animate-bounce">
          <Fish size={48} />
        </div>
        <div className="absolute top-20 right-20 opacity-20 animate-pulse">
          <UtensilsCrossed size={40} />
        </div>
        <div className="absolute bottom-10 left-20 opacity-20 animate-bounce delay-1000">
          <Wine size={32} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 animate-pulse delay-500">
          <Flame size={40} />
        </div>
      </section>

      {/* Category Navigation Section */}
      <section className="py-12 bg-white dark:bg-dark-950 border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8 text-dark-900 dark:text-white">
              Explora Nuestro Menú
            </h2>
            
            {/* Desktop Category Navigation */}
            <div className="hidden md:flex justify-center items-center space-x-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white shadow-xl scale-105'
                      : 'bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-dark-700 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {renderCategoryIcon(category.icon, 32)}
                  </div>
                  <span className="font-semibold text-sm text-center">{category.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Category Navigation */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    <div className="text-2xl mr-3">
                      {renderCategoryIcon(category.icon, 24)}
                    </div>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 text-dark-900 dark:text-white flex items-center justify-center">
              {categories.find(cat => cat.id === activeCategory) && (
                <span className="mr-3">
                  {renderCategoryIcon(categories.find(cat => cat.id === activeCategory)!.icon, 40)}
                </span>
              )}
              {categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
            
            <p className="text-center text-dark-600 dark:text-dark-400 mb-12">
              Descubre los sabores únicos de nuestra {categories.find(cat => cat.id === activeCategory)?.name.toLowerCase()}
            </p>

            <div className="grid gap-8 lg:grid-cols-2">
              {menuItems[activeCategory as keyof typeof menuItems]?.length > 0 ? (
                menuItems[activeCategory as keyof typeof menuItems].map((item: any, index: number) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-dark-950 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {item.spicy && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Flame size={12} className="mr-1" />
                          Picante
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Leaf size={12} className="mr-1" />
                          Vegetariano
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-primary-600 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-dark-900 dark:text-white font-heading">
                        {item.name}
                      </h3>
                      <ChefHat className="text-primary-600 dark:text-primary-400 ml-2" size={20} />
                    </div>
                    
                    <p className="text-dark-600 dark:text-dark-300 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag: string, idx: number) => (
                            <span 
                              key={idx}
                              className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium border border-orange-200 dark:border-orange-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredients */}
                    <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
                      <h4 className="text-sm font-semibold text-dark-800 dark:text-dark-200 mb-2">
                        Ingredientes principales:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients && item.ingredients.map((ingredient: string, idx: number) => (
                          <span 
                            key={idx}
                            className="bg-primary-100 dark:bg-dark-800 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs font-medium"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
              ) : (
                <div className="col-span-2 text-center py-16">
                  <ChefHat className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No hay platos disponibles
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    El chef está preparando deliciosas opciones para esta categoría
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurant Stats */}
      <RestaurantStats />

      {/* Chef Recommendations */}
      <ChefRecommendations />

      {/* Footer Info */}
      <footer className="bg-dark-950 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h3 className="text-3xl font-heading font-bold text-primary-400 mb-2">
                  TROPIQUAL
                </h3>
                <p className="text-primary-300 text-sm font-medium">
                  SUSHI & GRILL
                </p>
              </div>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Experiencia culinaria única que fusiona lo mejor de la cocina japonesa 
                con sabores peruanos y un toque occidental. Cada plato es una obra de arte 
                preparada con ingredientes frescos y técnicas tradicionales.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Fish size={24} />
                </div>
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Beef size={24} />
                </div>
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Wine size={24} />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-6 flex items-center text-white">
                <MapPin className="mr-2 text-primary-400" size={20} />
                Ubicación
              </h4>
              <div className="space-y-2 text-dark-300">
                <p>Plaza de la Encarnación, 23</p>
                <p>41003 Sevilla, España</p>
                <p className="text-primary-400 font-medium mt-4">
                  ¡En el corazón de Sevilla!
                </p>
              </div>
            </div>
            
            {/* Hours & Contact */}
            <div>
              <h4 className="text-xl font-semibold mb-6 flex items-center text-white">
                <Clock className="mr-2 text-primary-400" size={20} />
                Horarios
              </h4>
              <div className="space-y-2 text-dark-300 mb-6">
                <p>Domingo - Jueves</p>
                <p className="text-primary-400 font-medium">18:00 - 02:00</p>
                <p>Viernes & Sábado</p>
                <p className="text-primary-400 font-medium">18:00 - 03:00</p>
              </div>
              
              <div className="border-t border-dark-700 pt-6">
                <h5 className="font-semibold mb-3 flex items-center text-white">
                  <Phone className="mr-2 text-primary-400" size={16} />
                  Contacto
                </h5>
                <p className="text-primary-400 font-medium">+34 685 959 705</p>
                <p className="text-dark-300 text-sm">reservas@tropiqual.com</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-dark-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-dark-400 text-sm">
                  © 2024 Tropiqual Company. Todos los derechos reservados.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Instagram
                </a>
                <a href="https://www.tropiqualcompany.com" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                  Web Oficial
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
