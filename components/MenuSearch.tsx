'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItem {
  name: string
  description: string
  price: string
  spicy: boolean
  category: string
}

interface MenuSearchProps {
  menuItems: Record<string, MenuItem[]>
  onItemSelect?: (item: MenuItem) => void
}

export default function MenuSearch({ menuItems, onItemSelect }: MenuSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Flatten all menu items for searching
  const allItems = useMemo(() => {
    const items: (MenuItem & { category: string })[] = []
    Object.entries(menuItems).forEach(([category, categoryItems]) => {
      categoryItems.forEach(item => {
        items.push({ ...item, category })
      })
    })
    return items
  }, [menuItems])

  // Filter items based on search term and filters
  const filteredItems = useMemo(() => {
    let filtered = allItems

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(item =>
        selectedFilters.includes(item.category)
      )
    }

    return filtered
  }, [allItems, searchTerm, selectedFilters])

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchTerm('')
  }

  const categories = [
    { id: 'entradas', name: 'Entradas', icon: '🥢' },
    { id: 'sushi', name: 'Sushi', icon: '🍣' },
    { id: 'carnes', name: 'Carnes', icon: '🥩' },
    { id: 'pescados', name: 'Pescados', icon: '🐟' },
    { id: 'cocteles', name: 'Cócteles', icon: '🍸' }
  ]

  return (
    <div className="bg-white dark:bg-dark-950 rounded-lg shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 dark:text-dark-500" size={20} />
        <input
          type="text"
          placeholder="Buscar platos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-primary-50 dark:bg-dark-800 border border-primary-200 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 dark:text-white"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-dark-700 transition-colors"
        >
          <Filter size={16} />
          <span>Filtros</span>
        </button>

        {(selectedFilters.length > 0 || searchTerm) && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-dark-600 dark:text-dark-400 hover:text-dark-800 dark:hover:text-dark-200 transition-colors"
          >
            <X size={16} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleFilter(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilters.includes(category.id)
                      ? 'bg-primary-500 text-white'
                      : 'bg-primary-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {(searchTerm || selectedFilters.length > 0) && (
        <div>
          <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
            {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <motion.div
                key={`${item.category}-${item.name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemSelect?.(item)}
                className="p-4 bg-primary-50 dark:bg-dark-900 rounded-lg hover:bg-primary-100 dark:hover:bg-dark-800 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-dark-900 dark:text-white flex items-center">
                    {item.name}
                    {item.spicy && <span className="ml-2 text-red-500">🌶️</span>}
                  </h4>
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm text-dark-600 dark:text-dark-300 mb-2">
                  {item.description}
                </p>
                <span className="text-xs px-2 py-1 bg-primary-200 dark:bg-dark-700 text-primary-700 dark:text-primary-300 rounded">
                  {categories.find(cat => cat.id === item.category)?.name}
                </span>
              </motion.div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-dark-500 dark:text-dark-400">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
