export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  allergens?: string[];
  ingredients?: string[];
  spicy?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: MenuItem[];
}

export const menuData: Category[] = [
  {
    id: "sushi-sashimi",
    name: "Sushi & Sashimi",
    description: "Selección fresca de nuestro sushi bar",
    icon: "🍣",
    items: [
      {
        id: "salmon-sashimi",
        name: "Sashimi de Salmón",
        description: "Delicados cortes de salmón atlántico fresco, seleccionado diariamente por nuestro chef. Cortado al estilo tradicional japonés, servido con wasabi recién rallado, jengibre encurtido y salsa de soja premium.",
        price: 18.50,
        category: "sushi-sashimi",
        popular: true,
        gluten_free: true,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Salmón atlántico", "Wasabi", "Jengibre encurtido", "Salsa de soja"]
      },
      {
        id: "nigiri-selection",
        name: "Selección de Nigiri",
        description: "Una cuidadosa selección de 10 piezas de nigiri preparadas por nuestro maestro sushiman. Incluye salmón noruego, atún rojo, gambón mediterráneo y anguila glaseada con salsa teriyaki casera.",
        price: 24.90,
        category: "sushi-sashimi",
        popular: true,
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Arroz de sushi", "Salmón", "Atún rojo", "Gambón", "Anguila", "Nori", "Wasabi"]
      },
      {
        id: "tropiqual-roll",
        name: "Tropiqual Roll",
        description: "Nuestra especialidad de la casa: rollo de sushi con salmón ligeramente flameado, aguacate cremoso, pepino crujiente y nuestra exclusiva salsa teriyaki de la casa. Finalizado con sésamo tostado.",
        price: 16.80,
        category: "sushi-sashimi",
        popular: true,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Salmón flameado", "Aguacate", "Pepino", "Arroz de sushi", "Nori", "Salsa teriyaki", "Sésamo"]
      },
      {
        id: "dragon-roll",
        name: "Dragon Roll",
        description: "Impresionante rollo de tempura de langostino crujiente, cubierto con láminas de aguacate fresco y anguila glaseada. Decorado con sésamo negro y acompañado de salsa especial de la casa.",
        price: 19.20,
        category: "sushi-sashimi",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Tempura de langostino", "Aguacate", "Anguila", "Arroz", "Nori", "Sésamo negro", "Salsa especial"]
      },
      {
        id: "california-roll",
        name: "California Roll",
        description: "El clásico californiano reinventado: surimi de cangrejo premium, aguacate maduro, pepino fresco y mayonesa japonesa. Cubierto con sésamo tostado y servido con wasabi y jengibre.",
        price: 12.50,
        category: "sushi-sashimi",
        image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Surimi de cangrejo", "Aguacate", "Pepino", "Mayonesa japonesa", "Sésamo", "Arroz", "Nori"]
      }
    ]
  },
  {
    id: "nikkei-fusion",
    name: "Fusión Nikkei",
    description: "Lo mejor de la cocina japonesa y peruana",
    icon: "🌶️",
    items: [
      {
        id: "tiradito-salmon",
        name: "Tiradito de Salmón",
        description: "Finas láminas de salmón fresco marinado en nuestra leche de tigre casera, realzado con ají amarillo peruano, cilantro fresco y un toque de aceite de oliva virgen extra. Una explosión de sabores nikkei.",
        price: 16.90,
        category: "nikkei-fusion",
        spicy: true,
        popular: true,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Salmón fresco", "Leche de tigre", "Ají amarillo", "Cilantro", "Cebolla morada", "Aceite de oliva"]
      },
      {
        id: "causa-limeña",
        name: "Causa Limeña Nikkei",
        description: "Tradición peruana con toque japonés: capas de puré de papa amarilla sazonada con ají amarillo, rellena de palta cremosa, cangrejo fresco y nuestra mayonesa nikkei especial. Acompañada de huevo duro y aceitunas.",
        price: 14.50,
        category: "nikkei-fusion",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Papa amarilla", "Ají amarillo", "Palta", "Cangrejo", "Mayonesa nikkei", "Huevo", "Aceitunas"]
      },
      {
        id: "anticucho-corazon",
        name: "Anticucho de Corazón",
        description: "Tradicionales brochetas peruanas de corazón de ternera marinado 24 horas en ají panca, comino y especias secretas. Asado a la parrilla y acompañado de papas doradas y salsa huacatay.",
        price: 18.90,
        category: "nikkei-fusion",
        spicy: true,
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Corazón de ternera", "Ají panca", "Comino", "Especias", "Papa dorada", "Salsa huacatay"]
      },
      {
        id: "ceviche-nikkei",
        name: "Ceviche Nikkei",
        description: "Pescado del día cortado en cubos perfectos, marinado en nuestra leche de tigre con toques de jengibre y miso. Acompañado de ají amarillo, cebolla morada, camote, choclo y cancha serrana.",
        price: 19.80,
        category: "nikkei-fusion",
        spicy: true,
        popular: true,
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Pescado fresco", "Leche de tigre", "Jengibre", "Miso", "Ají amarillo", "Cebolla morada", "Camote", "Choclo"]
      }
    ]
  },
  {
    id: "parrilla",
    name: "Parrilla & Carnes",
    description: "Carnes y pescados a la brasa",
    icon: "🔥",
    items: [
      {
        id: "wagyu-steak",
        name: "Wagyu A5 (200g)",
        description: "Exclusivo corte de wagyu japonés A5, la máxima calidad mundial. Cocinado a la perfección en nuestra parrilla robata, sazonado únicamente con sal marina de Guérande y aceite de sésamo tostado. Una experiencia gastronómica única.",
        price: 89.90,
        category: "parrilla",
        popular: true,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Wagyu A5 japonés", "Sal marina de Guérande", "Aceite de sésamo tostado", "Verduras de temporada"]
      },
      {
        id: "robata-salmon",
        name: "Salmón Robata",
        description: "Filete de salmón noruego cocinado en nuestra parrilla japonesa robata, glaseado con miso blanco dulce y mirin. Acompañado de verduras de temporada asadas y arroz jazmín perfumado.",
        price: 26.50,
        category: "parrilla",
        gluten_free: true,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Salmón noruego", "Miso blanco", "Mirin", "Verduras de temporada", "Arroz jazmín"]
      },
      {
        id: "black-cod",
        name: "Bacalao Negro Miso",
        description: "Exquisito bacalao negro (sablefish) marinado durante 24 horas en nuestra mezcla especial de miso dulce, mirin y sake. Cocinado lentamente hasta lograr una textura mantecosa. Acompañado de brotes de bambú.",
        price: 32.90,
        category: "parrilla",
        popular: true,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Bacalao negro", "Miso dulce", "Mirin", "Sake", "Brotes de bambú", "Aceite de sésamo"]
      },
      {
        id: "yakitori-selection",
        name: "Selección Yakitori",
        description: "Cinco brochetas artesanales preparadas al estilo tradicional: pollo teriyaki, bacon enrollado en cebolleta, pimiento shishito, champiñón shiitake y corazón de pollo. Glaseadas con nuestra salsa tare casera.",
        price: 18.50,
        category: "parrilla",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Pollo", "Bacon", "Cebolleta", "Pimiento shishito", "Champiñón shiitake", "Salsa tare", "Sésamo"]
      }
    ]
  },
  {
    id: "cockteles",
    name: "Cócteles de Autor",
    description: "Creaciones únicas de nuestro bar",
    icon: "🍸",
    items: [
      {
        id: "tropiqual-signature",
        name: "Tropiqual Signature",
        description: "Nuestra creación exclusiva que combina gin premium, yuzu japonés fresco, sake junmai y tónica japonesa Fever Tree. Decorado con hojas frescas de shiso y servido en copa especial con hielo artesanal.",
        price: 12.50,
        category: "cockteles",
        popular: true,
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Gin premium", "Yuzu fresco", "Sake junmai", "Tónica japonesa", "Shiso", "Hielo artesanal"]
      },
      {
        id: "nikkei-sour",
        name: "Nikkei Sour",
        description: "Fusión perfecta entre Perú y Japón: pisco peruano premium, jarabe de ají amarillo casero, lima fresca, clara de huevo orgánica y gotas de bitter peruano. Espuma sedosa con un toque picante equilibrado.",
        price: 11.90,
        category: "cockteles",
        spicy: true,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Pisco peruano", "Ají amarillo", "Lima", "Clara de huevo", "Bitter peruano", "Azúcar"]
      },
      {
        id: "sake-martini",
        name: "Sake Martini",
        description: "Elegante reinterpretación del clásico martini: sake premium Dassai, ginebra japonesa Roku, pepino fresco y un toque sutil de wasabi. Servido en copa helada con una fina lámina de pepino como decoración.",
        price: 13.80,
        category: "cockteles",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Sake Dassai", "Ginebra Roku", "Pepino fresco", "Wasabi", "Vermut seco"]
      },
      {
        id: "umami-old-fashioned",
        name: "Umami Old Fashioned",
        description: "Revolucionaria versión del clásico americano: whisky japonés Nikka, jarabe de miso caramelo casero, bitter de sésamo negro y una piel de naranja carbonizada. Una experiencia umami inolvidable.",
        price: 15.20,
        category: "cockteles",
        popular: true,
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Whisky Nikka", "Miso caramelo", "Bitter de sésamo", "Piel de naranja", "Hielo esférico"]
      }
    ]
  },
  {
    id: "postres",
    name: "Postres",
    description: "Final dulce con toque japonés",
    icon: "🍰",
    items: [
      {
        id: "mochi-selection",
        name: "Selección de Mochi",
        description: "Cuatro delicadas piezas de mochi artesanales con sabores únicos: matcha ceremonial, sésamo negro tostado, yuzu cítrico y taro cremoso. Cada uno envuelto en suave masa de arroz glutinoso.",
        price: 9.80,
        category: "postres",
        vegetarian: true,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Masa de arroz glutinoso", "Matcha ceremonial", "Sésamo negro", "Yuzu", "Taro", "Azúcar"]
      },
      {
        id: "tempura-helado",
        name: "Helado Tempura",
        description: "Sorprendente helado de vainilla premium envuelto en tempura crujiente y dorada, servido inmediatamente con salsa caliente de chocolate belga, frutos rojos frescos y crumble de galleta.",
        price: 8.90,
        category: "postres",
        vegetarian: true,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Helado de vainilla", "Tempura", "Chocolate belga", "Frutos rojos", "Crumble de galleta"]
      },
      {
        id: "dorayaki",
        name: "Dorayaki Casero",
        description: "Tradicionales tortitas japonesas esponjosas hechas en casa, rellenas de anko (pasta dulce de judías rojas) y nata montada fresca. Acompañadas de té matcha ceremonial y polvo de azúcar glas.",
        price: 7.50,
        category: "postres",
        vegetarian: true,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Tortitas caseras", "Anko (pasta de judías)", "Nata montada", "Té matcha", "Azúcar glas"]
      }
    ]
  }
];
