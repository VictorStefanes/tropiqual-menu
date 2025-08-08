// Exemplo de como adicionar novos pratos ao cardápio
// Adicione novos itens nos arrays correspondentes em app/page.tsx

export const menuItemsExample = {
  // Categoria: entradas
  entradas: [
    {
      name: "Novo Prato",
      description: "Descrição detalhada do prato com ingredientes principais",
      price: "15€",
      spicy: false // true se for picante
    }
  ],

  // Categoria: sushi
  sushi: [
    {
      name: "Novo Roll",
      description: "Ingredientes do roll e modo de preparo",
      price: "18€",
      spicy: true
    }
  ],

  // Categoria: carnes
  carnes: [
    {
      name: "Nova Carne",
      description: "Tipo de carne, preparo e acompanhamentos",
      price: "25€",
      spicy: false
    }
  ],

  // Categoria: pescados
  pescados: [
    {
      name: "Novo Pescado",
      description: "Tipo de peixe, modo de preparo e molhos",
      price: "22€",
      spicy: false
    }
  ],

  // Categoria: cocteles
  cocteles: [
    {
      name: "Novo Coquetel",
      description: "Ingredientes e características especiais",
      price: "13€",
      spicy: false
    }
  ]
}

// Exemplo de como adicionar nova categoria
export const newCategory = {
  id: 'sobremesas',
  name: 'Sobremesas',
  icon: '🍰'
}

// Para adicionar:
// 1. Adicione o novo objeto newCategory ao array categories
// 2. Adicione o novo menuItems.sobremesas com os pratos
// 3. Atualize o tipo keyof typeof menuItems se necessário
