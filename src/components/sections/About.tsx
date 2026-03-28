'use client'

import { motion } from 'framer-motion'
import { Code2, Server, Database, Youtube } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import { useLanguage } from '@/context/LanguageContext'

const highlightIcons = [Server, Database, Code2, Youtube]

export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-obsidian/50 to-void" />
      <div className="grid-overlay opacity-20" />

      <div className="relative section-container">
        <SectionHeading
          number="01"
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-alert-red" />
                <div className="w-3 h-3 rounded-full bg-tactical-amber" />
                <div className="w-3 h-3 rounded-full bg-cyber-green" />
                <span className="ml-auto font-mono text-xs text-ghost">profile.md</span>
              </div>
              
              <p className="text-mist leading-relaxed">
                {t.about.bio1}
              </p>
              
              <p className="text-mist leading-relaxed">
                {t.about.bio2}
              </p>
              
              <p className="text-mist leading-relaxed">
                {t.about.bio3}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '5+', label: t.about.stats.experience },
                { value: '50+', label: t.about.stats.systems },
                { value: '15+', label: t.about.stats.projects },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4 bg-graphite/40 border border-steel/20 rounded-lg"
                >
                  <div className="font-display text-2xl font-bold text-cyber-green">{stat.value}</div>
                  <div className="font-mono text-xs text-ghost uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-2 gap-4">
            {t.about.highlightCards.map((item, index) => {
              const Icon = highlightIcons[index]
              return (
                <Card
                  key={item.title}
                  glow="green"
                  corners
                  className="p-5"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 rounded-lg mb-4">
                      <Icon className="w-5 h-5 text-cyber-green" />
                    </div>
                    <h3 className="font-semibold text-snow mb-2">{item.title}</h3>
                    <p className="text-sm text-ghost">{item.description}</p>
                  </motion.div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
