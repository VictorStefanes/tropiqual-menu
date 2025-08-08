import React from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Save, 
  Camera, 
  Upload, 
  DollarSign, 
  Clock, 
  Flame, 
  Leaf,
  Sparkles,
  Calculator,
  FileText
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

interface MenuItemModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
  allergenOptions: string[]
  tagOptions: string[]
}

export default function MenuItemModal({ 
  item, 
  isOpen, 
  onClose, 
  onSave, 
  allergenOptions, 
  tagOptions 
}: MenuItemModalProps) {
  const [editedItem, setEditedItem] = React.useState<MenuItem>(item)
  const [aiSuggestions, setAiSuggestions] = React.useState({
    description: '',
    tags: [] as string[],
    price: ''
  })

  React.useEffect(() => {
    setEditedItem(item)
  }, [item])

  const updateField = (field: keyof MenuItem, value: any) => {
    setEditedItem(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const calculateMargin = () => {
    const price = parseFloat(editedItem.price.replace('€', ''))
    const cost = parseFloat(editedItem.cost.replace('€', ''))
    if (price > 0 && cost > 0) {
      const margin = Math.round(((price - cost) / price) * 100)
      updateField('margin', margin + '%')
    }
  }

  const generateAIDescription = async () => {
    if (!editedItem.name || editedItem.ingredients.length === 0) {
      alert('Por favor, ingresa el nombre del plato y al menos un ingrediente para generar la descripción.')
      return
    }

    const dishName = editedItem.name.toLowerCase()
    const mainIngredients = editedItem.ingredients.slice(0, 3)
    const category = editedItem.category
    
    // Templates profesionales más específicos por categoría
    const templates = {
      entradas: [
        `Exquisita entrada de ${dishName} elaborada con ${mainIngredients.join(', ').toLowerCase()}, perfecta para despertar el paladar con una explosión de sabores que combinan tradición y modernidad en cada bocado.`,
        `Deliciosa ${dishName} preparada artesanalmente donde el ${mainIngredients[0]?.toLowerCase()} se encuentra con ${mainIngredients[1]?.toLowerCase()}, creando una experiencia gastronómica única que anticipa lo mejor de nuestra cocina.`,
        `Refinada ${dishName} que fusiona ${mainIngredients.slice(0, 2).join(' y ').toLowerCase()}, una creación que representa la esencia de nuestra propuesta culinaria con técnicas contemporáneas y sabores auténticos.`
      ],
      sushi: [
        `Nuestro ${dishName} combina la precisión japonesa con ingredientes de primera calidad como ${mainIngredients.join(', ').toLowerCase()}, resultado de técnicas ancestrales adaptadas a paladares contemporáneos.`,
        `Elaborado con la maestría tradicional del sushi, este ${dishName} destaca por su ${mainIngredients[0]?.toLowerCase()} fresco y la armonía perfecta con ${mainIngredients.slice(1, 3).join(', ').toLowerCase()}.`,
        `Pieza de sushi premium donde el ${mainIngredients[0]?.toLowerCase()} protagoniza una sinfonía de texturas junto a ${mainIngredients[1]?.toLowerCase()}, preparado por nuestro chef especializado en cocina japonesa.`
      ],
      carnes: [
        `Exquisita ${dishName} cocinada a la perfección, donde la calidad del ${mainIngredients[0]?.toLowerCase()} se realza con ${mainIngredients.slice(1).join(', ').toLowerCase()}, una experiencia carnívora que satisface los paladares más exigentes.`,
        `Jugosa ${dishName} preparada con técnicas de parrilla tradicional, el ${mainIngredients[0]?.toLowerCase()} alcanza su punto óptimo acompañado de ${mainIngredients[1]?.toLowerCase()}, creando un plato memorable.`,
        `Selecta ${dishName} que combina la nobleza del ${mainIngredients[0]?.toLowerCase()} con el sabor único de ${mainIngredients.slice(1, 3).join(' y ').toLowerCase()}, cocinada lentamente hasta lograr la textura perfecta.`
      ],
      pescados: [
        `Fresco ${dishName} del día, donde la calidad del ${mainIngredients[0]?.toLowerCase()} se complementa perfectamente con ${mainIngredients.slice(1).join(', ').toLowerCase()}, respetando la esencia marina con toques de nuestra cocina de autor.`,
        `Delicado ${dishName} preparado con técnicas que preservan la textura natural del ${mainIngredients[0]?.toLowerCase()}, marinado con ${mainIngredients[1]?.toLowerCase()} para crear una experiencia oceánica sublime.`,
        `Nuestro ${dishName} especial combina la frescura del ${mainIngredients[0]?.toLowerCase()} con sabores asiáticos como ${mainIngredients.slice(1, 3).join(' y ').toLowerCase()}, fusión perfecta entre mar y tradición culinaria.`
      ],
      cocteles: [
        `Refrescante ${dishName} elaborado con ${mainIngredients.join(', ').toLowerCase()}, una creación de nuestra barra que combina técnicas clásicas de coctelería con toques tropicales únicos.`,
        `Nuestro signature ${dishName} destaca por la calidad del ${mainIngredients[0]?.toLowerCase()} premium, balanceado perfectamente con ${mainIngredients.slice(1).join(' y ').toLowerCase()} para crear una experiencia sensorial única.`,
        `Elegante ${dishName} que fusiona ${mainIngredients[0]?.toLowerCase()} de alta gama con ${mainIngredients[1]?.toLowerCase()} fresco, servido con la precisión que caracteriza nuestra propuesta de coctelería de autor.`
      ]
    }
    
    const categoryTemplates = templates[category as keyof typeof templates] || templates.entradas
    const randomTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)]
    
    setAiSuggestions(prev => ({ ...prev, description: randomTemplate }))
  }

  const generateAITags = () => {
    const suggestedTags: string[] = []
    const dishName = editedItem.name.toLowerCase()
    const ingredients = editedItem.ingredients.map(ing => ing.toLowerCase())
    
    // Tags baseados em características do prato
    if (editedItem.spicy) suggestedTags.push('Picante')
    if (editedItem.vegetarian) suggestedTags.push('Vegetariano')
    
    // Tags baseados no tempo de preparação
    const prepTime = parseInt(editedItem.preparationTime)
    if (prepTime <= 10) suggestedTags.push('Rápido')
    if (prepTime >= 25) suggestedTags.push('Elaborado')
    
    // Tags baseados na categoria
    switch (editedItem.category) {
      case 'sushi':
        suggestedTags.push('Japonés', 'Fresco')
        if (ingredients.some(ing => ing.includes('salmón') || ing.includes('atún'))) {
          suggestedTags.push('Premium')
        }
        break
      case 'carnes':
        suggestedTags.push('Parrilla', 'Proteína')
        if (ingredients.some(ing => ing.includes('wagyu') || ing.includes('premium'))) {
          suggestedTags.push('Lujo')
        }
        break
      case 'pescados':
        suggestedTags.push('Marino', 'Saludable', 'Omega-3')
        break
      case 'entradas':
        suggestedTags.push('Aperitivo', 'Compartir')
        break
      case 'cocteles':
        suggestedTags.push('Refrescante', 'Tropical')
        if (ingredients.some(ing => ing.includes('gin') || ing.includes('whisky'))) {
          suggestedTags.push('Premium')
        }
        break
    }
    
    // Tags baseados em ingredientes específicos
    if (ingredients.some(ing => ing.includes('temporada') || ing.includes('estacional'))) {
      suggestedTags.push('Temporada')
    }
    if (ingredients.some(ing => ing.includes('miso') || ing.includes('sake') || ing.includes('soja'))) {
      suggestedTags.push('Japonés')
    }
    if (ingredients.some(ing => ing.includes('ají') || ing.includes('lima') || ing.includes('cilantro'))) {
      suggestedTags.push('Peruano', 'Nikkei')
    }
    if (ingredients.some(ing => ing.includes('orgánico') || ing.includes('ecológico'))) {
      suggestedTags.push('Orgánico')
    }
    if (ingredients.some(ing => ing.includes('trufa') || ing.includes('caviar') || ing.includes('foie'))) {
      suggestedTags.push('Gourmet', 'Lujo')
    }
    
    // Tags baseados no preço
    const price = parseFloat(editedItem.price.replace('€', ''))
    if (price >= 30) suggestedTags.push('Premium')
    if (price >= 50) suggestedTags.push('Lujo')
    
    // Tags baseados no nome do prato
    if (dishName.includes('especial') || dishName.includes('signature')) {
      suggestedTags.push('Especial', 'Signature')
    }
    if (dishName.includes('nuevo') || dishName.includes('novedad')) {
      suggestedTags.push('Nuevo')
    }
    
    // Sempre sugerir alguns tags gerais úteis
    suggestedTags.push('Popular', 'Recomendado')
    
    // Remover duplicados e limitar a 8 sugestões
    const uniqueTags = Array.from(new Set(suggestedTags)).slice(0, 8)
    
    setAiSuggestions(prev => ({ ...prev, tags: uniqueTags }))
  }

  const suggestPrice = () => {
    // Cálculo base a partir dos ingredientes e tempo
    const ingredientCosts = editedItem.ingredients.length * 2.5 // Base de €2.50 por ingrediente
    const timeComplexity = parseInt(editedItem.preparationTime) * 0.8 // €0.80 por minuto
    
    // Multiplicadores por categoria
    const categoryMultiplier = {
      'sushi': 1.4, // Premium japonês
      'carnes': 1.3, // Proteínas caras
      'pescados': 1.35, // Mariscos premium
      'entradas': 0.9, // Mais econômico
      'cocteles': 1.2, // Alcohol premium
      'postres': 1.0
    }[editedItem.category] || 1.0
    
    // Cálculo base
    let basePrice = (ingredientCosts + timeComplexity) * categoryMultiplier
    
    // Ajustes por características especiais
    if (editedItem.spicy) basePrice *= 1.05 // Pratos picantes +5%
    if (editedItem.vegetarian) basePrice *= 0.95 // Vegetarianos -5%
    
    // Análise de ingredientes premium
    const premiumIngredients = editedItem.ingredients.filter(ing => 
      ing.toLowerCase().includes('wagyu') ||
      ing.toLowerCase().includes('trufa') ||
      ing.toLowerCase().includes('caviar') ||
      ing.toLowerCase().includes('salmón') ||
      ing.toLowerCase().includes('atún') ||
      ing.toLowerCase().includes('langosta') ||
      ing.toLowerCase().includes('foie')
    )
    
    if (premiumIngredients.length > 0) {
      basePrice *= (1 + premiumIngredients.length * 0.2) // +20% por ingrediente premium
    }
    
    // Se há custo informado, usar como base mínima
    const cost = parseFloat(editedItem.cost.replace('€', '')) || 0
    if (cost > 0) {
      const costBasedPrice = cost * 2.8 // Margem de 64%
      basePrice = Math.max(basePrice, costBasedPrice)
    }
    
    // Arredondar para números atrativos (.95, .50, .00)
    const roundedPrice = Math.ceil(basePrice / 5) * 5 - 0.05
    
    setAiSuggestions(prev => ({ 
      ...prev, 
      price: `€${roundedPrice.toFixed(2)}`,
      priceAnalysis: {
        base: `€${basePrice.toFixed(2)}`,
        category: editedItem.category,
        multiplier: categoryMultiplier,
        premium: premiumIngredients.length > 0
      }
    }))
  }

  const applyAISuggestion = (type: 'description' | 'tags' | 'price') => {
    switch (type) {
      case 'description':
        updateField('description', aiSuggestions.description)
        break
      case 'tags':
        updateField('tags', Array.from(new Set([...editedItem.tags, ...aiSuggestions.tags])))
        break
      case 'price':
        updateField('price', aiSuggestions.price)
        calculateMargin()
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {editedItem.id.startsWith('new-') ? 'Nuevo Plato' : 'Editar Plato'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del plato *
                </label>
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Gyoza de Pato"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción *
                  </label>
                  <button
                    onClick={generateAIDescription}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                  >
                    <Sparkles size={12} className="mr-1" />
                    IA Generar
                  </button>
                </div>
                <textarea
                  value={editedItem.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Descripción atractiva del plato..."
                />
                {aiSuggestions.description && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Sugerencia IA:</p>
                        <p className="text-sm text-blue-700 mt-1">{aiSuggestions.description}</p>
                      </div>
                      <button
                        onClick={() => applyAISuggestion('description')}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredientes (separados por coma) *
                </label>
                <input
                  type="text"
                  value={editedItem.ingredients.join(', ')}
                  onChange={(e) => updateField('ingredients', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Pato confitado, Masa de gyoza, Cebollino..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo de producción
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={editedItem.cost}
                      onChange={(e) => updateField('cost', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0€"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Precio de venta *
                    </label>
                    <button
                      onClick={suggestPrice}
                      className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                    >
                      <Calculator size={12} className="mr-1" />
                      Sugerir
                    </button>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={editedItem.price}
                      onChange={(e) => {
                        updateField('price', e.target.value)
                        calculateMargin()
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0€"
                    />
                  </div>
                  {aiSuggestions.price && (
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-green-600">Sugerido: {aiSuggestions.price}</span>
                      <button
                        onClick={() => applyAISuggestion('price')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Margen de ganancia:</span>
                <span className="text-lg font-bold text-green-600">{editedItem.margin}</span>
              </div>
            </div>

            {/* Right Column - Advanced Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen (URL)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={editedItem.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                  <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload size={16} />
                  </button>
                </div>
                {editedItem.image && (
                  <div className="mt-2">
                    <img
                      src={editedItem.image}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de preparación
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={editedItem.preparationTime}
                      onChange={(e) => updateField('preparationTime', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="15 min"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificultad
                  </label>
                  <select
                    value={editedItem.difficulty}
                    onChange={(e) => updateField('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías (opcional)
                </label>
                <input
                  type="text"
                  value={editedItem.calories || ''}
                  onChange={(e) => updateField('calories', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="320 kcal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alérgenos
                </label>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map(allergen => (
                    <button
                      key={allergen}
                      onClick={() => updateField('allergens', toggleArrayItem(editedItem.allergens, allergen))}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        editedItem.allergens.includes(allergen)
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <button
                    onClick={generateAITags}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                  >
                    <Sparkles size={12} className="mr-1" />
                    IA Sugerir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      onClick={() => updateField('tags', toggleArrayItem(editedItem.tags, tag))}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        editedItem.tags.includes(tag)
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {aiSuggestions.tags.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Tags sugeridos:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {aiSuggestions.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => applyAISuggestion('tags')}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedItem.spicy}
                    onChange={(e) => updateField('spicy', e.target.checked)}
                    className="mr-2"
                  />
                  <Flame className="mr-1 text-red-500" size={16} />
                  Picante
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedItem.vegetarian}
                    onChange={(e) => updateField('vegetarian', e.target.checked)}
                    className="mr-2"
                  />
                  <Leaf className="mr-1 text-green-500" size={16} />
                  Vegetariano
                </label>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedItem.available}
                    onChange={(e) => updateField('available', e.target.checked)}
                    className="mr-2"
                  />
                  Disponible en menú
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedItem.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="mr-2"
                  />
                  Plato destacado
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <div className="text-sm text-gray-500">
              {editedItem.id.startsWith('new-') ? 'Nuevo plato' : `Creado por ${editedItem.createdBy} • ${editedItem.createdAt}`}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => onSave(editedItem)}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Guardar Plato
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
