'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'amber' | 'none'
  corners?: boolean
}

export default function Card({
  children,
  className,
  hover = true,
  glow = 'green',
  corners = false,
}: CardProps) {
  const glowStyles = {
    green: 'border-cyber-green/20 hover:border-cyber-green/40 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]',
    amber: 'border-tactical-amber/20 hover:border-tactical-amber/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]',
    none: 'border-steel/30 hover:border-steel/50',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        'relative bg-graphite/60 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300',
        glowStyles[glow],
        className
      )}
    >
      {corners && (
        <>
          <span className="hud-corner hud-corner-tl" />
          <span className="hud-corner hud-corner-tr" />
          <span className="hud-corner hud-corner-bl" />
          <span className="hud-corner hud-corner-br" />
        </>
      )}
      {children}
    </motion.div>
  )
}
