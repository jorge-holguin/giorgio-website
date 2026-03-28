'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Terminal, Crosshair, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const [roleIndex, setRoleIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % t.hero.roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [t.hero.roles.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="grid-overlay" />
      
      {/* Animated scan line */}
      <div className="scan-line" />

      {/* HUD corners */}
      <div className="absolute top-20 left-4 md:left-8 w-32 h-32">
        <span className="absolute top-0 left-0 w-8 h-px bg-cyber-green/50" />
        <span className="absolute top-0 left-0 w-px h-8 bg-cyber-green/50" />
      </div>
      <div className="absolute top-20 right-4 md:right-8 w-32 h-32">
        <span className="absolute top-0 right-0 w-8 h-px bg-cyber-green/50" />
        <span className="absolute top-0 right-0 w-px h-8 bg-cyber-green/50" />
      </div>
      <div className="absolute bottom-8 left-4 md:left-8 w-32 h-32">
        <span className="absolute bottom-0 left-0 w-8 h-px bg-cyber-green/50" />
        <span className="absolute bottom-0 left-0 w-px h-8 bg-cyber-green/50" />
      </div>
      <div className="absolute bottom-8 right-4 md:right-8 w-32 h-32">
        <span className="absolute bottom-0 right-0 w-8 h-px bg-cyber-green/50" />
        <span className="absolute bottom-0 right-0 w-px h-8 bg-cyber-green/50" />
      </div>

      {/* Main content */}
      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-graphite/60 border border-cyber-green/20 rounded-full font-mono text-sm text-cyber-green">
            <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            {t.hero.available}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-snow mb-6 tracking-wide"
        >
          JORGE{' '}
          <span className="text-gradient-cyber">HOLGUIN</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="h-12 mb-8 flex items-center justify-center"
        >
          <div className="flex items-center gap-3 font-mono text-lg md:text-xl text-mist">
            <Terminal className="w-5 h-5 text-cyber-green" />
            <span className="text-cyber-green">&gt;</span>
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-snow"
            >
              {t.hero.roles[roleIndex]}
            </motion.span>
            <span className="w-3 h-6 bg-cyber-green/80 animate-blink-caret" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-2xl mx-auto text-ghost text-lg mb-12"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            href="#projects"
            variant="primary"
            icon={<Terminal className="w-4 h-4" />}
          >
            {t.hero.cta.projects}
          </Button>
          <Button
            href="/tactical"
            variant="amber"
            icon={<Crosshair className="w-4 h-4" />}
          >
            {t.hero.cta.tactical}
          </Button>
          <Button
            href="#contact"
            variant="secondary"
            icon={<Send className="w-4 h-4" />}
          >
            {t.hero.cta.contact}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-ghost"
        >
          <span className="font-mono text-xs uppercase tracking-wider">{t.hero.scroll}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Status indicators */}
      <div className="absolute bottom-8 left-4 md:left-8 font-mono text-xs text-ghost hidden md:block">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-green rounded-full" />
          <span>{t.hero.status}</span>
        </div>
      </div>
      <div className="absolute bottom-8 right-4 md:right-8 font-mono text-xs text-ghost hidden md:block">
        <span>{t.hero.location}</span>
      </div>
    </section>
  )
}
