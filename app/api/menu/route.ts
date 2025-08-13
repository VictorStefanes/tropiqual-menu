import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'


interface MenuItem {
  id?: string
  name: string
  description: string
  ingredients: string[]
  price: string
  spicy: boolean
  vegetarian: boolean
  image: string
  category: string
  badges?: string[]
  created_at?: string
}

interface MenuData {
  [key: string]: MenuItem[]
}




// GET - Ler menu do Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })
    if (error) throw error
    // Agrupar por categoria igual ao antigo formato
    const grouped: { [key: string]: MenuItem[] } = {}
    data?.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    })
    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Erro ao ler menu:', error)
    return NextResponse.json({ error: 'Erro ao carregar menu' }, { status: 500 })
  }
}


// POST - Adicionar novo item ao menu (Supabase)
export async function POST(request: Request) {
  try {
    const newItem: MenuItem = await request.json()
    if (!newItem.name || !newItem.category || !newItem.price) {
      return NextResponse.json({ error: 'Nome, categoria e preço são obrigatórios' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ ...newItem }])
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, message: 'Item adicionado com sucesso', item: data })
  } catch (error) {
    console.error('Erro ao adicionar item:', error)
    return NextResponse.json({ error: 'Erro ao adicionar item' }, { status: 500 })
  }
}


// PUT - Atualizar item existente (Supabase)
export async function PUT(request: Request) {
  try {
    const { oldItem, newItem }: { oldItem: MenuItem, newItem: MenuItem } = await request.json()
    if (!newItem.name || !newItem.category || !newItem.price) {
      return NextResponse.json({ error: 'Nome, categoria e preço são obrigatórios' }, { status: 400 })
    }
    // Precisa do id do item antigo
    if (!oldItem.id) {
      // Buscar pelo nome, categoria e preço (fallback)
      const { data: found, error: findError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('name', oldItem.name)
        .eq('category', oldItem.category)
        .eq('price', oldItem.price)
        .limit(1)
        .single()
      if (findError || !found) {
        return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
      }
      oldItem.id = found.id
    }
    const { error } = await supabase
      .from('menu_items')
      .update({ ...newItem })
      .eq('id', oldItem.id)
    if (error) throw error
    return NextResponse.json({ success: true, message: 'Item atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
  }
}


// DELETE - Remover item (Supabase)
export async function DELETE(request: Request) {
  try {
    const { id, category, name }: { id?: string, category: string, name: string } = await request.json()
    if (!category || !name) {
      return NextResponse.json({ error: 'Categoria e nome são obrigatórios' }, { status: 400 })
    }
    let itemId = id
    if (!itemId) {
      // Buscar pelo nome e categoria (fallback)
      const { data: found, error: findError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('name', name)
        .eq('category', category)
        .limit(1)
        .single()
      if (findError || !found) {
        return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
      }
      itemId = found.id
    }
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId)
    if (error) throw error
    return NextResponse.json({ success: true, message: 'Item removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover item:', error)
    return NextResponse.json({ error: 'Erro ao remover item' }, { status: 500 })
  }
}
