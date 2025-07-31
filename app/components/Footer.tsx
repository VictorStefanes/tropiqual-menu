'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-elegant-lightGray border-t border-tropiqual-gold/30 py-16">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-3xl font-bold gradient-text mb-4 font-elegant">TROPIQUAL</h3>
            <p className="text-elegant-darkGray mb-6 leading-relaxed">
              Restaurante de Fusión, Sushi Steak House & Lounge Bar en el corazón de Sevilla.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a 
                href="https://www.instagram.com/tropiqualsevilla/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-elegant-cream/60 rounded-full hover:bg-tropiqual-gold hover:text-elegant-white transition-colors border border-tropiqual-gold/20"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/tropiqual/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-elegant-cream/60 rounded-full hover:bg-tropiqual-gold hover:text-elegant-white transition-colors border border-tropiqual-gold/20"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-xl font-semibold text-elegant-black mb-6 font-elegant">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 text-tropiqual-gold" />
                <div>
                  <p className="text-elegant-darkGray">Plaza de la Encarnación 23</p>
                  <p className="text-elegant-darkGray">41003 Sevilla</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-tropiqual-gold" />
                <a href="tel:+34685959705" className="text-elegant-darkGray hover:text-tropiqual-darkGold transition-colors">
                  +34 685 959 705
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Clock className="w-5 h-5 text-tropiqual-gold" />
                <div>
                  <p className="text-elegant-darkGray">Dom-Jue: 18:00-02:00</p>
                  <p className="text-elegant-darkGray">Vie-Sáb: 18:00-03:00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-xl font-semibold text-elegant-black mb-6 font-elegant">Servicios</h4>
            <div className="space-y-4">
              <a 
                href="https://www.tropiqualcompany.com/reservations"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 glass-card hover:bg-tropiqual-gold/10 transition-colors rounded-lg"
              >
                <h5 className="font-semibold text-tropiqual-gold mb-1">Reservas</h5>
                <p className="text-sm text-elegant-darkGray">Reserva tu mesa online</p>
              </a>
              <a 
                href="https://www.tropiqualcompany.com/delivery"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 glass-card hover:bg-tropiqual-gold/10 transition-colors rounded-lg"
              >
                <h5 className="font-semibold text-tropiqual-gold mb-1">Delivery</h5>
                <p className="text-sm text-elegant-darkGray">Pide a domicilio</p>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-tropiqual-gold/20 text-center"
        >
          <p className="text-elegant-darkGray text-sm mb-2">
            ©2024 Shake Events S.L. - Todos los derechos reservados
          </p>
          <p className="text-xs text-elegant-mediumGray">
            *Tropiqual y Sushi Tiki son hermanos
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
