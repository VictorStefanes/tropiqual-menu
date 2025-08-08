import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'full-menu.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar menu completo:', error)
    return NextResponse.json({ 
      error: 'Erro ao carregar dados do menu' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validar estrutura de dados
    const requiredCategories = ['entradas', 'sushi', 'carnes', 'pescados', 'cocteles']
    for (const category of requiredCategories) {
      if (!data[category] || !Array.isArray(data[category])) {
        return NextResponse.json({ 
          error: `Categoria ${category} é obrigatória e deve ser um array` 
        }, { status: 400 })
      }
    }
    
    // Validar cada item do menu
    const allItems = Object.values(data).flat() as any[]
    for (const item of allItems) {
      if (!item.id || !item.name || !item.price) {
        return NextResponse.json({ 
          error: 'Todos os itens devem ter id, name e price' 
        }, { status: 400 })
      }
    }
    
    const filePath = path.join(process.cwd(), 'data', 'full-menu.json')
    
    // Fazer backup do arquivo anterior
    const backupPath = path.join(process.cwd(), 'data', `full-menu-backup-${Date.now()}.json`)
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath)
    }
    
    // Salvar novo arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu atualizado com sucesso!',
      timestamp: new Date().toISOString(),
      itemsCount: allItems.length
    })
    
  } catch (error) {
    console.error('Erro ao salvar menu:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { category, item } = await request.json()
    
    if (!category || !item || !item.id) {
      return NextResponse.json({ 
        error: 'Categoria e item com ID são obrigatórios' 
      }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'data', 'full-menu.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    if (!data[category]) {
      return NextResponse.json({ 
        error: 'Categoria não encontrada' 
      }, { status: 404 })
    }
    
    // Atualizar item específico
    const existingIndex = data[category].findIndex((i: any) => i.id === item.id)
    
    if (existingIndex !== -1) {
      // Atualizar item existente
      data[category][existingIndex] = {
        ...item,
        updatedAt: new Date().toISOString().split('T')[0]
      }
    } else {
      // Adicionar novo item
      data[category].push({
        ...item,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      })
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item atualizado com sucesso!',
      item: data[category].find((i: any) => i.id === item.id)
    })
    
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const itemId = searchParams.get('id')
    
    if (!category || !itemId) {
      return NextResponse.json({ 
        error: 'Categoria e ID do item são obrigatórios' 
      }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'data', 'full-menu.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    if (!data[category]) {
      return NextResponse.json({ 
        error: 'Categoria não encontrada' 
      }, { status: 404 })
    }
    
    const initialLength = data[category].length
    data[category] = data[category].filter((item: any) => item.id !== itemId)
    
    if (data[category].length === initialLength) {
      return NextResponse.json({ 
        error: 'Item não encontrado' 
      }, { status: 404 })
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item removido com sucesso!' 
    })
    
  } catch (error) {
    console.error('Erro ao remover item:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
