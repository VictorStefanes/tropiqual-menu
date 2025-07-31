# 🍣 Tropiqual - Cardápio Digital

Um cardápio digital moderno e responsivo para o restaurante **Tropiqual** em Sevilha, especializado em fusão japonesa-nikkei.

## ✨ Características

### 🎨 Design
- **Interface moderna** com tema escuro elegante
- **Gradientes personalizados** em tons de laranja (marca Tropiqual)
- **Animações suaves** com Framer Motion
- **Totalmente responsivo** para desktop, tablet e mobile

### 🍱 Conteúdo do Menu
- **5 categorias principales:**
  - 🍣 **Sushi & Sashimi** - Selección fresca de nuestro sushi bar
  - 🌶️ **Fusión Nikkei** - Lo mejor de la cocina japonesa y peruana  
  - 🔥 **Parrilla & Carnes** - Carnes y pescados a la brasa
  - 🍸 **Cócteles de Autor** - Creaciones únicas de nuestro bar
  - 🍰 **Postres** - Final dulce con toque japonés

### 📸 Características Avançadas
- **Imágenes ilustrativas** para cada plato
- **Descrições detalhadas** de cada item
- **Lista de ingredientes** para cada prato
- **Indicadores visuais:** Popular ⭐, Picante 🌶️, Vegetariano 🌱, Sin Gluten
- **Precios en euros** claramente visibles
- **Información del restaurante** integrada

## 🏪 Información del Restaurante

**Tropiqual - Sushi & Grill**
- 📍 **Dirección:** Plaza de la Encarnación 23, 41003 Sevilla
- 📞 **Teléfono:** +34 685 959 705
- 🕒 **Horarios:** 
  - Domingo-Jueves: 18:00-02:00
  - Viernes-Sábado: 18:00-03:00
- 🌐 **Web:** [tropiqualcompany.com](https://www.tropiqualcompany.com)
- 📱 **Instagram:** [@tropiqualsevilla](https://www.instagram.com/tropiqualsevilla/)

## 🚀 Tecnologías Utilizadas

- **[Next.js 14](https://nextjs.org/)** - Framework React de última generación
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitario
- **[Framer Motion](https://www.framer.com/motion/)** - Librería de animaciones
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Next/Image](https://nextjs.org/docs/api-reference/next/image)** - Optimización de imágenes

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd cardapio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles
```bash
npm run dev      # Servidor de desarrollo (http://localhost:3000)
npm run build    # Crear build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 📁 Estructura del Proyecto

```
cardapio/
├── app/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx      # Cabecera con hero section
│   │   ├── Menu.tsx        # Componente principal del menú
│   │   ├── MenuItem.tsx    # Item individual del menú
│   │   └── Footer.tsx      # Pie de página
│   ├── data/
│   │   └── menu.ts         # Datos del menú y tipos TypeScript
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── public/                 # Archivos estáticos
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind
├── tsconfig.json          # Configuración de TypeScript
└── next.config.js         # Configuración de Next.js
```

## 🎨 Personalización

### Colores
El tema de colores está definido en `tailwind.config.js`:
- **Primary:** Tonos naranjas (#f97316)
- **Dark:** Grises oscuros para el fondo
- **Accent:** Colores complementarios para indicadores

### Añadir Nuevos Platos
1. Editar `app/data/menu.ts`
2. Añadir nuevo objeto `MenuItem` con:
   - `name`: Nombre del plato
   - `description`: Descripción detallada
   - `price`: Precio en euros
   - `image`: URL de la imagen
   - `ingredients`: Array de ingredientes
   - `category`: Categoría correspondiente

### Configurar Imágenes
Las imágenes están configuradas en `next.config.js` para aceptar dominios externos como Unsplash.

## 🌟 Características Especiales

- **Scroll suave** entre secciones
- **Lazy loading** de imágenes optimizado
- **Efectos hover** en elementos interactivos
- **Transiciones fluidas** entre categorías
- **Glass morphism** en tarjetas
- **Responsive design** móvil-first

## 📱 Responsive Design

- **Mobile-first:** Diseñado primero para móviles
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegación adaptativa** según el dispositivo
- **Imágenes responsivas** con Next/Image

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Otros Providers
- **Netlify:** Conectar repositorio y deploy automático
- **Digital Ocean:** App Platform
- **Heroku:** Con buildpack de Node.js

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- 📧 Email: [contacto]
- 🐛 Issues: [GitHub Issues]

---

**Desarrollado con ❤️ para Tropiqual Sevilla**
