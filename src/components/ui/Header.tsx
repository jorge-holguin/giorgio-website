'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const { t } = useLanguage()
  
  const navItems = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.techStack, href: '#tech-stack' },
    { name: t.nav.content, href: '#content' },
    { name: t.nav.contact, href: '#contact' },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-obsidian/90 backdrop-blur-xl border-b border-steel/30'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyber-green/10 rounded border border-cyber-green/30 group-hover:border-cyber-green/60 transition-colors" />
              <Terminal className="w-5 h-5 text-cyber-green" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-semibold text-snow tracking-wider">
                JORGE
              </span>
              <span className="font-display text-lg font-semibold text-cyber-green tracking-wider">
                .DEV
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-mono text-mist hover:text-cyber-green transition-colors relative group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 bg-cyber-green/0 group-hover:bg-cyber-green/5 rounded transition-colors" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <Link
              href="/tactical"
              className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-hub-orange border border-hub-orange/30 rounded hover:bg-hub-orange/10 hover:border-hub-orange/60 transition-all"
            >
              <Crosshair className="w-4 h-4" />
              <span>{t.nav.tacticalMode}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-mist hover:text-cyber-green transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-obsidian/95 backdrop-blur-xl border-b border-steel/30"
          >
            <div className="section-container py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 font-mono text-sm text-mist hover:text-cyber-green hover:bg-cyber-green/5 rounded transition-all"
                  >
                    <span className="text-cyber-green/50 mr-2">0{index + 1}.</span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-4 border-t border-steel/30 space-y-3"
              >
                <div className="flex items-center justify-center gap-3">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
                <Link
                  href="/tactical"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 font-mono text-sm text-hub-orange border border-hub-orange/30 rounded hover:bg-hub-orange/10 transition-all"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>{t.nav.tacticalMode}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
