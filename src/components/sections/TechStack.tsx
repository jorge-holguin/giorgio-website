'use client'

import { motion } from 'framer-motion'
import { Server, Layout, Database, Cloud, Wrench } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { techStack } from '@/data/mock-data'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

const categoryMeta = [
  { id: 'backend', labelKey: 'backend' as const, icon: Server, color: 'cyber-green' },
  { id: 'frontend', labelKey: 'frontend' as const, icon: Layout, color: 'cyber-green' },
  { id: 'databases', labelKey: 'database' as const, icon: Database, color: 'tactical-amber' },
  { id: 'devops', labelKey: 'devops' as const, icon: Cloud, color: 'tactical-amber' },
  { id: 'tools', labelKey: 'tools' as const, icon: Wrench, color: 'mist' },
]

export default function TechStack() {
  const { t } = useLanguage()

  return (
    <section id="tech-stack" className="relative py-24 md:py-32 bg-obsidian/30">
      <div className="grid-overlay opacity-10" />

      <div className="relative section-container">
        <SectionHeading
          number="04"
          title={t.techStack.title}
          subtitle={t.techStack.subtitle}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryMeta.map((category, catIndex) => {
            const Icon = category.icon
            const skills = techStack[category.id as keyof typeof techStack]

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                className="glass-panel p-6"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                    category.color === 'cyber-green' 
                      ? 'bg-cyber-green/10 border-cyber-green/30' 
                      : category.color === 'tactical-amber'
                      ? 'bg-tactical-amber/10 border-tactical-amber/30'
                      : 'bg-steel/20 border-steel/30'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      category.color === 'cyber-green' 
                        ? 'text-cyber-green' 
                        : category.color === 'tactical-amber'
                        ? 'text-tactical-amber'
                        : 'text-mist'
                    }`} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-snow">
                    {t.techStack.categories[category.labelKey]}
                  </h3>
                </div>

                {/* Skills Grid with Icons */}
                <div className="grid grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIndex * 0.1 + index * 0.05 }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-mono text-xs text-ghost text-center group-hover:text-snow transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional tech note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-ghost text-sm font-mono">
            <span className="text-cyber-green">{'// '}</span> {t.techStack.learningNote}
            {' '}{t.techStack.currentlyExploring} <span className="text-snow">AI/ML</span>, <span className="text-snow">Rust</span>, <span className="text-snow">WebAssembly</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
