import AIDemo from '@/components/AIDemo'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function DemoAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/menu-admin"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao Admin
          </Link>
          
          <div className="flex items-center">
            <Sparkles className="text-purple-600 mr-2" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IA do Tropiqual - Demo
            </h1>
          </div>
        </div>

        {/* Demonstração */}
        <AIDemo />

        {/* Informações Adicionais */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Por que esta IA é diferente?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Características Técnicas</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <span><strong>Análise por Categoria:</strong> Cada tipo de prato (sushi, carnes, pescados) tem algoritmos específicos</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <span><strong>Detecção de Ingredientes Premium:</strong> Reconhece wagyu, trufa, caviar e ajusta automaticamente</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <span><strong>Cálculo de Margem Inteligente:</strong> Considera tempo, complexidade e posicionamento de mercado</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <span><strong>Templates Adaptativos:</strong> Linguagem ajustada ao tipo de culinária (japonesa, peruana, etc.)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Benefícios Práticos</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>Economiza Tempo:</strong> Gera descrições profissionais em segundos</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>Otimiza Preços:</strong> Garante margem adequada para cada categoria</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>Padroniza Qualidade:</strong> Todas as descrições seguem padrão profissional</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span><strong>Reduz Erros:</strong> Funcionários não precisam criar conteúdo do zero</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link 
            href="/menu-admin"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <Sparkles size={20} className="mr-2" />
            Testar IA no Sistema Real
          </Link>
        </div>
      </div>
    </div>
  )
}
