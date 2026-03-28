'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// Lazy load the Three.js room for performance
const TacticalRoom = dynamic(() => import('@/components/tactical/TacticalRoom'), {
  loading: () => <TacticalLoader />,
  ssr: false,
})

const TacticalPanelOverlay = dynamic(() => import('@/components/tactical/TacticalPanelOverlay'), {
  loading: () => null,
  ssr: false,
})

const TacticalMobile = dynamic(() => import('@/components/tactical/TacticalMobile'), {
  loading: () => <TacticalLoader />,
  ssr: false,
})

function TacticalLoader() {
  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-cyber-green animate-pulse">
          INITIALIZING...
        </p>
      </div>
    </div>
  )
}

export default function TacticalModePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const { t, locale, toggleLocale } = useLanguage()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
      setTimeout(() => setIsReady(true), 500)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="dark">
      <div className="fixed inset-0 bg-void overflow-hidden">
        {/* Intro sequence */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 bg-void flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-mono text-sm text-cyber-green mb-8 space-y-1"
                >
                  {t.tactical.bootSequence.map((msg, i) => (
                    <motion.p
                      key={`boot-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.3 }}
                      className={i === 3 ? 'text-tactical-amber' : i === 4 ? 'text-cyber-green' : ''}
                    >
                      {msg}
                    </motion.p>
                  ))}
                </motion.div>

                <div className="w-64 h-1 bg-graphite rounded-full overflow-hidden mx-auto">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="h-full bg-cyber-green"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : -20 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 z-40"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-graphite/80 backdrop-blur-sm border border-steel/30 rounded-lg text-mist hover:text-cyber-green hover:border-cyber-green/50 transition-all font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.tactical.exit}</span>
          </Link>
        </motion.div>

        {/* Language toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : -20 }}
          transition={{ delay: 0.35 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-4 py-2 bg-graphite/80 backdrop-blur-sm border border-steel/30 rounded-lg text-mist hover:text-cyber-green hover:border-cyber-green/50 transition-all font-mono text-sm"
          >
            <span className={locale === 'es' ? 'text-cyber-green font-bold' : 'text-ghost'}>ES</span>
            <span className="text-steel">/</span>
            <span className={locale === 'en' ? 'text-cyber-green font-bold' : 'text-ghost'}>EN</span>
          </button>
        </motion.div>

        {/* Device indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : -20 }}
          transition={{ delay: 0.4 }}
          className="absolute top-4 right-4 z-40"
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-graphite/80 backdrop-blur-sm border border-steel/30 rounded-lg font-mono text-xs text-ghost">
            {isMobile ? (
              <>
                <Smartphone className="w-4 h-4 text-tactical-amber" />
                <span>{t.tactical.mobileMode}</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-cyber-green" />
                <span>{t.tactical.desktopMode}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Main tactical interface */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            {isMobile ? (
              <TacticalMobile />
            ) : (
              <>
                <div className="absolute inset-0 z-0">
                  <TacticalRoom 
                    onOpenPanel={setActivePanel}
                    targets={t.tactical.targets}
                    instructions={t.tactical.instructions}
                  />
                </div>
                {activePanel && (
                  <div className="absolute inset-0 z-20">
                    <TacticalPanelOverlay 
                      panelType={activePanel} 
                      onClose={() => setActivePanel(null)} 
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
