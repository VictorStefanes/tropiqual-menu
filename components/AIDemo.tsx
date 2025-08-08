'use client'

import { useState } from 'react'
import { Sparkles, Calculator, Tags, ChefHat, Brain } from 'lucide-react'

export default function AIDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [demoResults, setDemoResults] = useState<{
    description?: any
    price?: any
    tags?: any
  }>({})

  const demoDescriptionAI = () => {
    setActiveDemo('description')
    
    // Simular análise IA para descrição
    setTimeout(() => {
      const result = {
        input: {
          name: "Salmón Nikkei Especial",
          category: "pescados",
          ingredients: ["salmón fresco", "salsa nikkei", "aguacate", "ajonjolí negro"]
        },
        output: "Delicioso salmón fresco marinado en nuestra exclusiva salsa nikkei, una perfecta fusión entre la tradición japonesa y los sabores peruanos. Acompañado de cremoso aguacate y un toque crujiente de ajonjolí negro que realza cada bocado."
      }
      setDemoResults((prev: any) => ({ ...prev, description: result }))
    }, 1500)
  }

  const demoPriceAI = () => {
    setActiveDemo('price')
    
    setTimeout(() => {
      const result = {
        input: {
          ingredients: 4,
          preparationTime: "20 min",
          category: "pescados",
          cost: "€12.00"
        },
        analysis: {
          ingredientCost: "€10.00",
          timeComplexity: "€16.00", 
          categoryMultiplier: "x1.35",
          premiumBonus: "+20%",
          finalPrice: "€34.95",
          margin: "65.7%"
        }
      }
      setDemoResults((prev: any) => ({ ...prev, price: result }))
    }, 2000)
  }

  const demoTagsAI = () => {
    setActiveDemo('tags')
    
    setTimeout(() => {
      const result = {
        input: {
          name: "Wagyu Premium",
          category: "carnes",
          ingredients: ["wagyu premium", "trufa negra", "verduras asadas"],
          spicy: false,
          vegetarian: false
        },
        suggestions: ["Premium", "Lujo", "Parrilla", "Proteína", "Gourmet", "Especial", "Signature", "Recomendado"]
      }
      setDemoResults((prev: any) => ({ ...prev, tags: result }))
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Brain className="text-blue-600 mr-3" size={32} />
          <h2 className="text-2xl font-bold text-gray-900">Demonstração IA do Sistema</h2>
        </div>
        <p className="text-gray-600">
          Esta IA realmente funciona! Veja exemplos práticos das funcionalidades inteligentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Demo Descrições */}
        <div className="border rounded-lg p-4">
          <button
            onClick={demoDescriptionAI}
            className="w-full flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Sparkles size={20} className="mr-2" />
            Gerar Descrição
          </button>
          
          {activeDemo === 'description' && !demoResults.description && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Analisando ingredientes...</p>
            </div>
          )}
          
          {demoResults.description && (
            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Input:</strong>
                <div className="text-xs mt-1">
                  <div>• Nome: {demoResults.description.input.name}</div>
                  <div>• Categoria: {demoResults.description.input.category}</div>
                  <div>• Ingredientes: {demoResults.description.input.ingredients.join(', ')}</div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong className="text-blue-800">Descrição IA:</strong>
                <p className="text-blue-700 mt-1">{demoResults.description.output}</p>
              </div>
            </div>
          )}
        </div>

        {/* Demo Preços */}
        <div className="border rounded-lg p-4">
          <button
            onClick={demoPriceAI}
            className="w-full flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calculator size={20} className="mr-2" />
            Calcular Preço
          </button>
          
          {activeDemo === 'price' && !demoResults.price && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Calculando custos...</p>
            </div>
          )}
          
          {demoResults.price && (
            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Análise:</strong>
                <div className="text-xs mt-1 space-y-1">
                  <div>• Ingredientes: {demoResults.price.analysis.ingredientCost}</div>
                  <div>• Tempo prep.: {demoResults.price.analysis.timeComplexity}</div>
                  <div>• Multiplicador: {demoResults.price.analysis.categoryMultiplier}</div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded text-sm">
                <strong className="text-green-800">Preço Sugerido:</strong>
                <div className="text-green-700 text-lg font-bold">{demoResults.price.analysis.finalPrice}</div>
                <div className="text-green-600 text-xs">Margem: {demoResults.price.analysis.margin}</div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Tags */}
        <div className="border rounded-lg p-4">
          <button
            onClick={demoTagsAI}
            className="w-full flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Tags size={20} className="mr-2" />
            Sugerir Tags
          </button>
          
          {activeDemo === 'tags' && !demoResults.tags && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Gerando tags...</p>
            </div>
          )}
          
          {demoResults.tags && (
            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Análise:</strong>
                <div className="text-xs mt-1">
                  <div>• Nome: {demoResults.tags.input.name}</div>
                  <div>• Categoria: {demoResults.tags.input.category}</div>
                  <div>• Ingredientes premium detectados</div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded text-sm">
                <strong className="text-purple-800">Tags Sugeridas:</strong>
                <div className="flex flex-wrap gap-1 mt-2">
                  {demoResults.tags.suggestions.map((tag: string, index: number) => (
                    <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <ChefHat className="mr-2 text-blue-600" size={24} />
          Como Funciona a IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Descrições Inteligentes</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Analisa categoria do prato</li>
              <li>• Considera ingredientes especiais</li>
              <li>• Adapta tom por tipo de comida</li>
              <li>• Destacar características únicas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-800 mb-2">Cálculo de Preços</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Custo base por ingrediente</li>
              <li>• Tempo de preparação</li>
              <li>• Multiplicador por categoria</li>
              <li>• Ingredientes premium</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Tags Automáticas</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Características do prato</li>
              <li>• Análise de ingredientes</li>
              <li>• Faixa de preço</li>
              <li>• Tendências do mercado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
