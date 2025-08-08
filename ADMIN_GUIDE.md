# 🧑‍🍳 Guia de Administração - Recomendações do Chef

## 📋 **Como Gerenciar as Recomendações**

### 🎯 **Localização do Arquivo**
```
/data/chef-recommendations.json
```

### ⚙️ **Configurações Principais**

#### **Ativar/Desativar Seção**
```json
"active": true  // true = mostra a seção | false = oculta completamente
```

#### **Textos da Seção**
```json
"title": "Recomendaciones del Chef",
"subtitle": "Nuestras especialidades más destacadas..."
```

#### **Controle de Quantidade**
- **Minimum**: 1 recomendação
- **Maximum**: Ilimitado (recomendado até 6)
- **Layout automático**: 1-2 items = linha única | 3+ = grid responsivo

### 🍽️ **Estrutura de uma Recomendação**

```json
{
  "id": "identificador-unico",
  "name": "Nome do Prato",
  "description": "Descrição detalhada...",
  "price": "25€",
  "category": "entradas|sushi|carnes|pescados|cocteles",
  "image": "URL_da_imagem",
  "badges": ["Chef's Choice", "Premium", "Seasonal"],
  "specialIngredients": ["Ingredient 1", "Ingredient 2"],
  "available": true,    // true = disponível | false = oculta
  "featured": true      // true = destaque | false = normal
}
```

### 🏷️ **Badges Disponíveis**

| Badge | Cor | Ícone | Uso |
|-------|-----|-------|-----|
| `"Chef's Choice"` | Laranja | Chef Hat | Escolha pessoal do chef |
| `"Premium"` | Dourado | Coroa | Ingredientes premium |
| `"Seasonal"` | Verde | Estrela | Produtos da temporada |
| `"Signature"` | Roxo | Prêmio | Prato assinatura |
| `"Fusion"` | Rosa | Coração | Fusão de sabores |

### ✏️ **Como Editar**

#### **Para Adicionar Nova Recomendação:**
1. Abra `/data/chef-recommendations.json`
2. Adicione novo objeto no array `"recommendations"`
3. Use um ID único
4. Salve o arquivo
5. A página será atualizada automaticamente

#### **Para Remover Recomendação:**
- **Opção 1**: Delete o objeto do array
- **Opção 2**: Mude `"available": false`

#### **Para Reordenar:**
- Mova os objetos dentro do array `"recommendations"`
- A ordem no arquivo = ordem na página

### 🔄 **Exemplos de Cenários**

#### **Cenário 1: Menu de Verão (2 pratos)**
```json
{
  "active": true,
  "title": "Especiales de Verano",
  "subtitle": "Sabores frescos para la temporada estival",
  "recommendations": [
    {
      "id": "ceviche-verano",
      "name": "Ceviche Tropical",
      "badges": ["Seasonal", "Chef's Choice"],
      // ... resto da configuração
    },
    {
      "id": "cocktail-verano",
      "name": "Mojito de Maracuyá",
      "badges": ["Seasonal", "Signature"],
      // ... resto da configuração
    }
  ]
}
```

#### **Cenário 2: Evento Especial (5 pratos)**
```json
{
  "title": "Menú Degustación Nikkei",
  "subtitle": "Una experiencia culinaria única de 5 tiempos",
  "recommendations": [
    // 5 objetos de recomendação...
  ]
}
```

#### **Cenário 3: Desativar Temporariamente**
```json
{
  "active": false,
  // ... resto fica igual, seção não aparece no site
}
```

### 📅 **Controle de Atualizações**
```json
"lastUpdated": "2025-08-08",     // Data da última modificação
"updatedBy": "Chef Hiroshi"      // Quem fez a modificação
```

### 🚀 **Futuras Melhorias Planejadas**

1. **Interface Web**: Painel administrativo para editar sem tocar no código
2. **Agendamento**: Definir quando recomendações devem aparecer/sumir
3. **A/B Testing**: Testar diferentes recomendações
4. **Analytics**: Rastrear cliques e popularidade
5. **Integração**: Conectar com sistema de pedidos

### ⚠️ **Dicas Importantes**

- **Backup**: Sempre faça backup antes de editar
- **Formato JSON**: Cuidado com vírgulas e aspas
- **Imagens**: Use URLs que funcionem (teste no navegador)
- **Tamanho**: Recomendado máximo 4-5 recomendações por vez
- **Atualização**: Mudanças aparecem instantaneamente no site

### 🆘 **Solução de Problemas**

**Se a seção não aparecer:**
1. Verifique se `"active": true`
2. Verifique se há pelo menos 1 item com `"available": true` e `"featured": true`
3. Verifique a sintaxe JSON (vírgulas, aspas)

**Se layout estiver quebrado:**
- Verifique URLs das imagens
- Confirme que todos os campos obrigatórios estão preenchidos

---

**📞 Suporte**: Para implementar melhorias ou resolver problemas, entre em contato!
