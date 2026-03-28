'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  number?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  number,
  title,
  subtitle,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-4 mb-4',
        align === 'center' && 'justify-center'
      )}>
        {number && (
          <span className="font-mono text-sm text-cyber-green">
            {number}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-bold text-snow tracking-wide">
          {title}
        </h2>
        {align === 'left' && (
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-steel/50 to-transparent max-w-xs" />
        )}
      </div>
      {subtitle && (
        <p className={cn(
          'text-ghost max-w-2xl',
          align === 'center' && 'mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
