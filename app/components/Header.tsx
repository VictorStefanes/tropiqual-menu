'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Instagram } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-elegant-white via-elegant-lightGray to-elegant-cream border-b border-tropiqual-gold/30"
    >
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(248,249,250,0.8)), url('https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        
        <div className="relative z-10 text-center section-padding max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-elegant">
              <span className="gradient-text">TROPIQUAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-tropiqual-lightGold dark:text-tropiqual-gold mb-4 font-light">
              SUSHI & GRILL
            </p>
            <div className="w-24 h-1 tropiqual-gradient-bg mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-elegant-darkGray mb-8 leading-relaxed">
              Comida japonesa con alma Nikkei, carnes y<br />
              pescados a la brasa, cócteles de autor,<br />
              y un ligero acento occidental.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="glass-card p-6 text-center hover:bg-tropiqual-gold/10 transition-colors">
              <MapPin className="w-8 h-8 text-tropiqual-gold mx-auto mb-3" />
              <h3 className="font-semibold text-elegant-black mb-2">Ubicación</h3>
              <p className="text-elegant-darkGray text-sm">
                Plaza de la Encarnación 23<br />
                41003 Sevilla
              </p>
            </div>
            
            <div className="glass-card p-6 text-center hover:bg-tropiqual-gold/10 transition-colors">
              <Clock className="w-8 h-8 text-tropiqual-gold mx-auto mb-3" />
              <h3 className="font-semibold text-elegant-black mb-2">Horarios</h3>
              <p className="text-elegant-darkGray text-sm">
                Dom-Jue: 18:00-02:00<br />
                Vie-Sáb: 18:00-03:00
              </p>
            </div>
            
            <div className="glass-card p-6 text-center hover:bg-tropiqual-gold/10 transition-colors">
              <Phone className="w-8 h-8 text-tropiqual-gold mx-auto mb-3" />
              <h3 className="font-semibold text-elegant-black mb-2">Contacto</h3>
              <p className="text-elegant-darkGray text-sm">
                +34 685 959 705<br />
                @tropiqualsevilla
              </p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-tropiqual-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
