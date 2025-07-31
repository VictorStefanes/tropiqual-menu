'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar preferência salva ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={toggleTheme}
        className="group flex items-center gap-3 px-4 py-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-2 border-tropiqual-gold/30 dark:border-tropiqual-gold/50 hover:border-tropiqual-gold hover:bg-tropiqual-gold/5 dark:hover:bg-tropiqual-gold/10 transition-all duration-300 shadow-lg hover:shadow-xl"
        aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      >
        <div className="relative">
          {isDark ? (
            <Sun className="w-5 h-5 text-tropiqual-gold group-hover:text-tropiqual-lightGold transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-tropiqual-gold group-hover:text-tropiqual-darkGold transition-colors" />
          )}
        </div>
        <span className="text-sm font-medium text-elegant-darkGray dark:text-gray-200 group-hover:text-tropiqual-gold transition-colors">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      </button>
    </div>
  );
}
