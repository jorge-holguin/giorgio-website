'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      external,
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-wider transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-cyber-green/50 focus:ring-offset-2 focus:ring-offset-void',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    )

    const variants = {
      primary: cn(
        'bg-cyber-green text-void border border-cyber-green',
        'hover:bg-cyber-green-dim hover:border-cyber-green-dim',
        'shadow-[0_0_20px_rgba(74,222,128,0.2)]',
        'hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]'
      ),
      secondary: cn(
        'bg-graphite text-cyber-green border border-cyber-green/30',
        'hover:bg-cyber-green/10 hover:border-cyber-green/60',
        'hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]'
      ),
      ghost: cn(
        'bg-transparent text-mist border border-transparent',
        'hover:text-cyber-green hover:bg-cyber-green/5'
      ),
      amber: cn(
        'bg-graphite text-tactical-amber border border-tactical-amber/30',
        'hover:bg-tactical-amber/10 hover:border-tactical-amber/60',
        'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    const clipPath = 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </>
    )

    const buttonStyles = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )

    if (href) {
      const LinkComponent = external ? 'a' : Link
      const linkProps = external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {}

      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LinkComponent
            href={href}
            className={buttonStyles}
            style={{ clipPath }}
            {...linkProps}
          >
            {buttonContent}
          </LinkComponent>
        </motion.div>
      )
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={buttonStyles}
        style={{ clipPath }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
