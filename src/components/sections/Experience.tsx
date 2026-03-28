'use client'

import { motion } from 'framer-motion'
import { Building2, Calendar, MapPin, ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { useLanguage } from '@/context/LanguageContext'

export default function Experience() {
  const { t, locale } = useLanguage()
  const dateLocale = locale === 'es' ? 'es-PE' : 'en-US'

  return (
    <section id="experience" className="relative py-24 md:py-32 bg-obsidian/30">
      <div className="grid-overlay opacity-10" />

      <div className="relative section-container">
        <SectionHeading
          number="02"
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-green/50 via-cyber-green/20 to-transparent transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {t.experience.jobs.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-void border-2 border-cyber-green rounded-full transform -translate-x-[7px] md:-translate-x-1/2 z-10">
                  <span className="absolute inset-0 bg-cyber-green/30 rounded-full animate-ping" />
                </div>

                {/* Date card - desktop */}
                <div className={`hidden md:flex md:w-1/2 ${
                  index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'
                }`}>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-graphite/60 border border-steel/30 rounded font-mono text-sm text-cyber-green">
                      <Calendar className="w-4 h-4" />
                      {new Date(exp.startDate).toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })}
                      {' — '}
                      {exp.current ? t.experience.current : new Date(exp.endDate!).toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div className={`md:w-1/2 pl-8 md:pl-0 ${
                  index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
                }`}>
                  <div className="glass-panel p-6 hover:border-cyber-green/30 transition-colors">
                    {/* Mobile date */}
                    <div className="md:hidden mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-graphite/60 border border-steel/30 rounded font-mono text-xs text-cyber-green">
                        <Calendar className="w-3 h-3" />
                        {new Date(exp.startDate).toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })}
                        {' — '}
                        {exp.current ? t.experience.current : new Date(exp.endDate!).toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-snow mb-1">{exp.role}</h3>
                        <div className="flex items-center gap-2 text-cyber-green">
                          <Building2 className="w-4 h-4" />
                          <span className="font-mono text-sm">{exp.company}</span>
                        </div>
                      </div>
                      {exp.current && (
                        <span className="px-2 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded text-xs font-mono text-cyber-green">
                          {t.experience.current}
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-ghost text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-mist text-sm mb-4">{exp.description}</p>

                    {/* Achievements */}
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.slice(0, 3).map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ghost">
                          <ChevronRight className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-graphite border border-steel/30 rounded text-xs font-mono text-mist"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
