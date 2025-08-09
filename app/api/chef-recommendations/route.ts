import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chef-recommendations-limpo.json')
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      // Se não existe, criar arquivo padrão
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
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
      return NextResponse.json(defaultData)
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Verificar se o arquivo não está vazio
    if (!fileContent.trim()) {
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
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
      return NextResponse.json(defaultData)
    }
    
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar recomendações do chef:', error)
    
    // Em caso de erro, retornar dados padrão
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
    
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Em produção, aqui você salvaria no banco de dados
    // Para demonstração, vamos simular o salvamento
    
    const filePath = path.join(process.cwd(), 'data', 'chef-recommendations-limpo.json')
    
    // Validar dados
    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    
    // Adicionar timestamp
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: Date.now()
    }
    
    // Salvar arquivo (em produção seria banco de dados)
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recomendações atualizadas com sucesso!',
      timestamp: updatedData.lastUpdated
    })
    
  } catch (error) {
    console.error('Erro ao salvar recomendações:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
