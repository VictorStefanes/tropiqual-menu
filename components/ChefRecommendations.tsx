'use client'

import { motion } from 'framer-motion'
import { ChefHat, Star, Flame, Heart, Award, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChefRecommendation {
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
}

interface ChefRecommendationsData {
  active: boolean
  title: string
  subtitle: string
  recommendations: ChefRecommendation[]
  lastUpdated: string
  updatedBy: string
}

export default function ChefRecommendations() {
  const [data, setData] = useState<ChefRecommendationsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate loading the JSON data
    const loadRecommendations = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // This would normally be: const response = await fetch('/api/chef-recommendations')
        // For now, we'll use the static data structure
        const mockData: ChefRecommendationsData = {
          active: true,
          title: "Recomendaciones del Chef",
          subtitle: "Nuestras especialidades más destacadas, seleccionadas personalmente por nuestro chef ejecutivo",
          recommendations: [
            {
              id: "wagyu-special",
              name: "Wagyu Premium",
              description: "Chuletón de wagyu A5 japonés, cocinado a la perfección con técnicas tradicionales de la parrilla japonesa",
              price: "65€",
              category: "carnes",
              image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
              badges: ["Chef's Choice", "Premium"],
              specialIngredients: ["Wagyu A5", "Sal negra", "Miso dulce"],
              available: true,
              featured: true
            },
            {
              id: "omakase-sushi",
              name: "Omakase Selection",
              description: "Degustación de 8 piezas de sushi seleccionadas por nuestro chef, con pescados frescos del día",
              price: "48€",
              category: "sushi",
              image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop",
              badges: ["Chef's Choice", "Seasonal"],
              specialIngredients: ["Pescados del día", "Arroz premium", "Wasabi fresco"],
              available: true,
              featured: true
            },
            {
              id: "nikkei-fusion",
              name: "Ceviche Nikkei Deluxe",
              description: "Nuestra interpretación más refinada del ceviche, con pescado de temporada y nuestros toques japoneses únicos",
              price: "24€",
              category: "entradas",
              image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
              badges: ["Signature", "Fusion"],
              specialIngredients: ["Pescado de temporada", "Leche de tigre especial", "Microgreens"],
              available: true,
              featured: true
            }
          ],
          lastUpdated: "2025-08-08",
          updatedBy: "Chef Hiroshi"
        }
        
        setData(mockData)
      } catch (error) {
        console.error('Error loading chef recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "chef's choice":
        return <ChefHat size={14} />
      case 'premium':
        return <Crown size={14} />
      case 'seasonal':
        return <Star size={14} />
      case 'signature':
        return <Award size={14} />
      case 'fusion':
        return <Heart size={14} />
      default:
        return <Star size={14} />
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "chef's choice":
        return 'bg-orange-500 text-white'
      case 'premium':
        return 'bg-yellow-500 text-white'
      case 'seasonal':
        return 'bg-green-500 text-white'
      case 'signature':
        return 'bg-purple-500 text-white'
      case 'fusion':
        return 'bg-pink-500 text-white'
      default:
        return 'bg-primary-500 text-white'
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-2xl h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!data?.active || !data.recommendations.length) {
    return null // Don't render if inactive or no recommendations
  }

  // Filter only available and featured recommendations
  const availableRecommendations = data.recommendations.filter(
    rec => rec.available && rec.featured
  )

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="text-primary-600 dark:text-primary-400 mr-3" size={32} />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              {data.title}
            </h2>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {new Date(data.lastUpdated).toLocaleDateString('es-ES')} por {data.updatedBy}
          </div>
        </motion.div>

        <div className={`grid gap-8 ${
          availableRecommendations.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
          availableRecommendations.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
          availableRecommendations.length === 3 ? 'md:grid-cols-3' :
          availableRecommendations.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
          'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {availableRecommendations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-dark-950 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {item.badges.map((badge, badgeIndex) => (
                    <span 
                      key={badgeIndex}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${getBadgeColor(badge)}`}
                    >
                      {getBadgeIcon(badge)}
                      <span className="ml-1">{badge}</span>
                    </span>
                  ))}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-600 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
                    {item.price}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold font-heading">{item.name}</h3>
                  <p className="text-sm opacity-90 capitalize">{item.category}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Special Ingredients */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Ingredientes especiales:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {item.specialIngredients.map((ingredient, idx) => (
                      <span 
                        key={idx}
                        className="bg-primary-100 dark:bg-dark-800 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-dark-800 rounded-full flex items-center justify-center mr-3">
                      <ChefHat className="text-primary-600 dark:text-primary-400" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Recomendación especial
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chef ejecutivo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Categoría: {item.category}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Admin note (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
              💡 Administradores: Para modificar estas recomendaciones, editen el archivo /data/chef-recommendations.json
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
