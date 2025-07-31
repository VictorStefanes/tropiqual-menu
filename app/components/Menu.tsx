'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { menuData, Category } from '../data/menu';
import MenuItemComponent from './MenuItem';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>(menuData[0].id);

  const activeData = useMemo(() => 
    menuData.find(cat => cat.id === activeCategory) || menuData[0], 
    [activeCategory]
  );

  return (
    <section className="py-20 bg-gradient-to-b from-elegant-white to-elegant-lightGray">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6 font-elegant">
            Nuestra Carta
          </h2>
          <p className="text-xl text-elegant-darkGray max-w-2xl mx-auto">
            Una experiencia culinaria que fusiona lo mejor de Japón y Perú
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {menuData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 will-change-transform ${
                activeCategory === category.id
                  ? 'tropiqual-gradient-bg text-elegant-white shadow-lg scale-105'
                  : 'bg-elegant-lightGray/60 text-elegant-darkGray hover:bg-tropiqual-gold/20 hover:text-tropiqual-darkGold hover:scale-102 border border-tropiqual-gold/20'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Active Category */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-elegant-black mb-2 font-elegant">
              <span className="mr-3">{activeData.icon}</span>
              {activeData.name}
            </h3>
            <p className="text-elegant-darkGray">{activeData.description}</p>
          </div>

          <div className="grid gap-6 md:gap-8">
            {activeData.items.map((item, index) => (
              <MenuItemComponent key={item.id} item={item} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Service Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-elegant-black mb-4 font-elegant">Información de Servicio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-elegant-darkGray">
              <div>
                <p className="font-semibold text-tropiqual-darkGold mb-2">Servicio de Mesa</p>
                <p>€1.00 por persona</p>
              </div>
              <div>
                <p className="font-semibold text-tropiqual-darkGold mb-2">Carta de Alérgenos</p>
                <p>Disponible bajo petición</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-tropiqual-gold/30">
              <p className="text-xs text-elegant-mediumGray">
                Los precios incluyen IVA. Consulte con nuestro personal sobre ingredientes alérgenos.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
