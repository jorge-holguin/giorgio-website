'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage()

  return (
    <motion.button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-void-light dark:bg-void-light hover:bg-void-lighter dark:hover:bg-void-lighter transition-colors border border-white/10 text-sm font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <Globe className="w-4 h-4 text-giorgio-purple" />
      <span className="text-white/80">{locale === 'es' ? 'EN' : 'ES'}</span>
    </motion.button>
  )
}
