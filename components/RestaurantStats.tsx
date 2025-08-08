'use client'

import { motion } from 'framer-motion'
import { Star, Users, Clock, Award } from 'lucide-react'

export default function RestaurantStats() {
  // TODO: Future integration with Google Places API
  // const [realStats, setRealStats] = useState(null);
  // useEffect(() => {
  //   fetchGooglePlacesData().then(setRealStats);
  // }, []);
  
  const stats = [
    {
      icon: Star,
      value: "4.3",
      label: "Valoración",
      description: "Clientes satisfechos"
    },
    {
      icon: Users,
      value: "3K+",
      label: "Clientes",
      description: "Nos visitan cada año"
    },
    {
      icon: Clock,
      value: "5",
      label: "Años",
      description: "De experiencia"
    },
    {
      icon: Award,
      value: "2",
      label: "Reconocimientos",
      description: "Locales recibidos"
    }
  ]

  return (
    <section className="py-16 bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 dark:text-white mb-4">
            Nuestra Excelencia en Números
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
            La confianza de nuestros clientes y el reconocimiento de la crítica gastronómica nos avalan
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-primary-100 dark:bg-dark-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-dark-700 transition-colors">
                <stat.icon className="text-primary-600 dark:text-primary-400" size={28} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-dark-600 dark:text-dark-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
