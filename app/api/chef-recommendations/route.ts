
import { NextResponse } from 'next/server'
import { supabaseChef } from '../../../lib/supabaseChef'


// GET: retorna todas as recomendações do chef
export async function GET() {
  try {
    const { data, error } = await supabaseChef
      .from('chef_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ recommendations: data || [] })
  } catch (error) {
    console.error('Erro ao carregar recomendações do chef:', error)
    return NextResponse.json({ recommendations: [] })
  }
}

// POST: adiciona ou atualiza recomendações do chef (bulk update)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.recommendations || !Array.isArray(body.recommendations)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    // Limpa a tabela e insere tudo de novo (simples, mas seguro para bulk update)
    const { error: delError } = await supabaseChef.from('chef_recommendations').delete().neq('id', '')
    if (delError) throw delError
    if (body.recommendations.length > 0) {
      // Remove id vazio para deixar o Supabase gerar
      const toInsert = body.recommendations.map((rec: any) => {
        const { id, ...rest } = rec
        return rest
      })
      const { error: insError } = await supabaseChef.from('chef_recommendations').insert(toInsert)
      if (insError) throw insError
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar recomendações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

