'use client'

import Link from 'next/link'
import { Github, Linkedin, Youtube, Twitter, Terminal, ArrowUp } from 'lucide-react'
import { mockSocialLinks } from '@/data/mock-data'

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-obsidian border-t border-steel/30">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-cyber-green/10 rounded border border-cyber-green/30">
                <Terminal className="w-5 h-5 text-cyber-green" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-snow tracking-wider">
                  JORGE
                </span>
                <span className="font-display text-lg font-semibold text-cyber-green tracking-wider">
                  .DEV
                </span>
              </div>
            </div>
            <p className="text-sm text-ghost max-w-xs">
              Full Stack Developer crafting robust backend systems and creating tech content at El Hub de Giorgio.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm text-cyber-green uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              {['About', 'Experience', 'Projects', 'Tech Stack', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-ghost hover:text-cyber-green transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tactical"
                  className="text-sm text-tactical-amber hover:text-tactical-amber/80 transition-colors"
                >
                  Tactical Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm text-cyber-green uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {mockSocialLinks.map((social) => {
                const Icon = socialIcons[social.icon] || Github
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-graphite border border-steel/30 rounded hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5 text-ghost group-hover:text-cyber-green transition-colors" />
                  </a>
                )
              })}
            </div>
            <p className="text-sm text-ghost">
              Available for freelance projects and full-time opportunities.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-steel/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ghost font-mono">
            <span className="text-cyber-green">©</span> {new Date().getFullYear()} Jorge Holguin. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ghost font-mono">
              Built with <span className="text-cyber-green">Next.js</span> + <span className="text-cyber-green">TypeScript</span>
            </span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 flex items-center justify-center bg-graphite border border-steel/30 rounded hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 text-ghost group-hover:text-cyber-green transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
