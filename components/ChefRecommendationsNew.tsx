'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Flame, Leaf, ChefHat, Sparkles } from 'lucide-react'

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
}

interface ChefRecommendationsData {
  active: boolean
  title: string
  subtitle: string
  recommendations: Recommendation[]
  lastUpdated: string
  updatedBy: string
}

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case 'Chef\'s Choice':
      return <ChefHat size={12} />
    case 'Premium':
      return <Star size={12} />
    case 'Seasonal':
      return <Clock size={12} />
    case 'Signature':
      return <Sparkles size={12} />
    case 'Fusion':
      return <Flame size={12} />
    default:
      return <Star size={12} />
  }
}

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'Chef\'s Choice':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Premium':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Seasonal':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Signature':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Fusion':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function ChefRecommendations() {
  const [data, setData] = useState<ChefRecommendationsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/chef-recommendations')
      const recommendationsData = await response.json()
      setData(recommendationsData)
    } catch (error) {
      console.error('Error loading chef recommendations:', error)
      // Fallback to JSON file if API fails
      try {
        const fallbackResponse = await fetch('/data/chef-recommendations.json')
        const fallbackData = await fallbackResponse.json()
        setData(fallbackData)
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const getDisplayName = (rec: Recommendation) => {
    return rec.name
  }

  const getDisplayDescription = (rec: Recommendation) => {
    return rec.description
  }

  const getDisplayPrice = (rec: Recommendation) => {
    return rec.price
  }

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!data || !data.active || !data.recommendations || data.recommendations.length === 0) {
    return null
  }

  // Filter only available recommendations
  const availableRecommendations = data.recommendations.filter(rec => rec.available && rec.featured)

  if (availableRecommendations.length === 0) {
    return null
  }

  // Calculate grid layout based on number of items
  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return 'grid-cols-1 max-w-md mx-auto'
    if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
    if (itemCount === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (itemCount === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    if (itemCount === 5) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="text-amber-600 mr-3" size={32} />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-black">
              {data.title}
            </h2>
          </div>
          <p className="text-lg text-black max-w-3xl mx-auto">
            {data.subtitle}
          </p>
          {data.updatedBy && (
            <p className="text-sm text-amber-600 mt-2">
              Actualizado por {data.updatedBy} • {data.lastUpdated}
            </p>
          )}
        </motion.div>

        <div className={`grid gap-6 ${getGridClass(availableRecommendations.length)}`}>
          {availableRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={recommendation.image}
                  alt={getDisplayName(recommendation)}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <div className="flex flex-col gap-1">
                    {recommendation.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge)} backdrop-blur-sm`}
                      >
                        {getBadgeIcon(badge)}
                        <span className="ml-1">{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3">
                  <span className="bg-amber-600 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
                    {getDisplayPrice(recommendation)}
                  </span>
                </div>

                {/* Special indicators - Removed spicy/vegetarian flags */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {/* Future: Add special indicators here if needed */}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-3 font-heading">
                  {getDisplayName(recommendation)}
                </h3>
                
                <p className="text-black mb-4 leading-relaxed line-clamp-3">
                  {getDisplayDescription(recommendation)}
                </p>

                {/* Special Ingredients */}
                {recommendation.specialIngredients && recommendation.specialIngredients.length > 0 && (
                  <div className="border-t border-amber-100 dark:border-dark-700 pt-4">
                    <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center">
                      <Sparkles size={14} className="mr-1" />
                      Ingredientes destacados
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.specialIngredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-black mb-6">
            ¿Te han gustado nuestras recomendaciones? Nuestro chef estará encantado de preparártelas.
          </p>
          <a
            href="tel:+34685959705"
            className="inline-flex items-center px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <ChefHat size={20} className="mr-2" />
            Reservar Mesa
          </a>
        </motion.div>
      </div>
    </section>
  )
}
