'use client';

import { motion } from 'framer-motion';
import { MenuItem } from '../data/menu';
import { Flame, Leaf, Award, ChefHat } from 'lucide-react';
import Image from 'next/image';

interface MenuItemProps {
  item: MenuItem;
  index: number;
}

export default function MenuItemComponent({ item, index }: MenuItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card p-6 hover:bg-tropiqual-gold/10 transition-all duration-200 group will-change-transform"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image */}
        {item.image && (
          <div className="lg:w-48 lg:h-32 w-full h-48 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 192px"
              className="object-cover group-hover:scale-105 transition-transform duration-200 will-change-transform"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+on//Z"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-elegant-black group-hover:text-tropiqual-darkGold transition-colors">
                  {item.name}
                </h3>
                <div className="flex gap-1">
                  {item.popular && (
                    <div title="Popular">
                      <Award className="w-4 h-4 text-tropiqual-gold" />
                    </div>
                  )}
                  {item.spicy && (
                    <div title="Picante">
                      <Flame className="w-4 h-4 text-accent-red" />
                    </div>
                  )}
                  {(item.vegetarian || item.vegan) && (
                    <div title="Vegetariano">
                      <Leaf className="w-4 h-4 text-accent-green" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-elegant-darkGray text-sm leading-relaxed mb-3">
                {item.description}
              </p>
              
              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="w-4 h-4 text-tropiqual-gold" />
                    <span className="text-xs font-semibold text-tropiqual-darkGold uppercase tracking-wide">
                      Ingredientes
                    </span>
                  </div>
                  <p className="text-xs text-elegant-mediumGray italic">
                    {item.ingredients.join(' • ')}
                  </p>
                </div>
              )}
              
              {item.allergens && item.allergens.length > 0 && (
                <p className="text-xs text-elegant-mediumGray italic">
                  Alérgenos: {item.allergens.join(', ')}
                </p>
              )}
            </div>
            <div className="ml-4 text-right">
              <span className="text-2xl font-bold text-tropiqual-gold">
                €{item.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2 text-xs">
              {item.gluten_free && (
                <span className="px-2 py-1 bg-accent-blue/20 text-blue-300 rounded-full">
                  Sin Gluten
                </span>
              )}
              {item.vegetarian && (
                <span className="px-2 py-1 bg-accent-green/20 text-green-300 rounded-full">
                  Vegetariano
                </span>
              )}
              {item.vegan && (
                <span className="px-2 py-1 bg-accent-green/30 text-green-400 rounded-full">
                  Vegano
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
