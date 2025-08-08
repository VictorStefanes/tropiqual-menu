import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chef-recommendations.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar recomendações do chef:', error)
    return NextResponse.json({ 
      error: 'Erro ao carregar recomendações do chef' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Em produção, aqui você salvaria no banco de dados
    // Para demonstração, vamos simular o salvamento
    
    const filePath = path.join(process.cwd(), 'data', 'chef-recommendations.json')
    
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
