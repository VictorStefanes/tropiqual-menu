import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface MenuItem {
  name: string
  description: string
  ingredients: string[]
  price: string
  spicy: boolean
  vegetarian: boolean
  image: string
  category: string
}

interface MenuData {
  [key: string]: MenuItem[]
}

const menuPath = path.join(process.cwd(), 'data', 'menu-limpo.json')

// GET - Ler menu
export async function GET() {
  try {
    const menuData = fs.readFileSync(menuPath, 'utf8')
    const menu = JSON.parse(menuData)
    return NextResponse.json(menu)
  } catch (error) {
    console.error('Erro ao ler menu:', error)
    return NextResponse.json({ error: 'Erro ao carregar menu' }, { status: 500 })
  }
}

// POST - Adicionar novo item ao menu
export async function POST(request: Request) {
  try {
    const newItem: MenuItem = await request.json()
    
    // Validação básica
    if (!newItem.name || !newItem.category || !newItem.price) {
      return NextResponse.json(
        { error: 'Nome, categoria e preço são obrigatórios' }, 
        { status: 400 }
      )
    }

    // Ler dados atuais
    const menuData = fs.readFileSync(menuPath, 'utf8')
    const menu: MenuData = JSON.parse(menuData)
    
    // Se a categoria não existe, criar
    if (!menu[newItem.category]) {
      menu[newItem.category] = []
    }
    
    // Adicionar item à categoria
    menu[newItem.category].push(newItem)
    
    // Salvar de volta
    fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item adicionado com sucesso',
      item: newItem 
    })
  } catch (error) {
    console.error('Erro ao adicionar item:', error)
    return NextResponse.json({ error: 'Erro ao adicionar item' }, { status: 500 })
  }
}

// PUT - Atualizar item existente
export async function PUT(request: Request) {
  try {
    const { category, index, item }: { category: string, index: number, item: MenuItem } = await request.json()
    
    // Ler dados atuais
    const menuData = fs.readFileSync(menuPath, 'utf8')
    const menu: MenuData = JSON.parse(menuData)
    
    if (!menu[category] || !menu[category][index]) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }
    
    // Atualizar item
    menu[category][index] = item
    
    // Salvar de volta
    fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item atualizado com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
  }
}

// DELETE - Remover item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const index = searchParams.get('index')
    
    if (!category || index === null) {
      return NextResponse.json({ error: 'Categoria e índice são obrigatórios' }, { status: 400 })
    }
    
    // Ler dados atuais
    const menuData = fs.readFileSync(menuPath, 'utf8')
    const menu: MenuData = JSON.parse(menuData)
    
    if (!menu[category] || !menu[category][parseInt(index)]) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }
    
    // Remover item
    menu[category].splice(parseInt(index), 1)
    
    // Salvar de volta
    fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item removido com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao remover item:', error)
    return NextResponse.json({ error: 'Erro ao remover item' }, { status: 500 })
  }
}
