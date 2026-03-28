'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, User, Briefcase, Code2, Mail, X, Target } from 'lucide-react'
import { mockProjects, techStack } from '@/data/mock-data'
import { useLanguage } from '@/context/LanguageContext'
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos'

type SectionId = 'about' | 'projects' | 'tech' | 'content' | 'contact'

interface Section {
  id: SectionId
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const sectionDefs: Section[] = [
  { id: 'about', icon: User, color: 'cyber-green' },
  { id: 'projects', icon: Briefcase, color: 'tactical-amber' },
  { id: 'tech', icon: Code2, color: 'cyber-green' },
  { id: 'content', icon: User, color: 'alert-red' },
  { id: 'contact', icon: Mail, color: 'tactical-amber' },
]

export default function TacticalMobile() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const { t } = useLanguage()

  const currentSection = sectionDefs[currentIndex]

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sectionDefs.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sectionDefs.length) % sectionDefs.length)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-void to-graphite">
        <div className="grid-overlay opacity-20" />
        <div className="scan-line opacity-20" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 text-center border-b border-steel/30">
        <h1 className="font-display text-lg font-bold text-cyber-green tracking-widest">
          {t.tactical.briefingRoom}
        </h1>
        <p className="font-mono text-xs text-ghost mt-1">
          {t.tactical.swipeToNavigate}
        </p>
      </div>

      {/* Section indicator */}
      <div className="relative z-10 flex justify-center gap-2 py-4">
        {sectionDefs.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? `bg-${section.color} shadow-[0_0_10px_rgba(74,222,128,0.5)]`
                : 'bg-steel/50'
            }`}
          />
        ))}
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <button
              onClick={() => setActiveSection(currentSection.id)}
              className="w-full p-8 bg-graphite/60 backdrop-blur-sm border border-steel/30 rounded-xl active:scale-95 transition-transform"
            >
              <div className={`w-20 h-20 mx-auto flex items-center justify-center bg-${currentSection.color}/10 border border-${currentSection.color}/30 rounded-2xl mb-6`}>
                <currentSection.icon className={`w-10 h-10 text-${currentSection.color}`} />
              </div>
              <h2 className="font-display text-xl font-bold text-snow uppercase tracking-wider mb-2">
                {t.tactical.hotspots[currentSection.id]}
              </h2>
              <div className="flex items-center justify-center gap-2 text-ghost font-mono text-sm">
                <Target className="w-4 h-4" />
                <span>{t.tactical.tapToAccess}</span>
              </div>
            </button>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-graphite/60 backdrop-blur-sm border border-steel/30 rounded-full active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-mist" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-graphite/60 backdrop-blur-sm border border-steel/30 rounded-full active:scale-90 transition-transform"
        >
          <ChevronRight className="w-6 h-6 text-mist" />
        </button>
      </div>

      {/* Section count */}
      <div className="relative z-10 p-4 text-center border-t border-steel/30">
        <span className="font-mono text-sm text-ghost">
          <span className="text-cyber-green">{(currentIndex + 1).toString().padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{sectionDefs.length.toString().padStart(2, '0')}</span>
        </span>
      </div>

      {/* Full screen panel */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-0 z-50 bg-void overflow-auto"
          >
            <div className="sticky top-0 flex items-center justify-between p-4 bg-obsidian/90 backdrop-blur-sm border-b border-steel/30 z-10">
              <div className="flex items-center gap-3">
                {(() => {
                  const section = sectionDefs.find(s => s.id === activeSection)
                  if (!section) return null
                  const Icon = section.icon
                  return (
                    <>
                      <div className={`w-8 h-8 flex items-center justify-center bg-${section.color}/10 border border-${section.color}/30 rounded`}>
                        <Icon className={`w-4 h-4 text-${section.color}`} />
                      </div>
                      <span className="font-display text-sm font-semibold text-snow uppercase tracking-wider">
                        {t.tactical.hotspots[section.id]}
                      </span>
                    </>
                  )
                })()}
              </div>
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 text-ghost active:text-snow transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              {activeSection === 'about' && <MobileAboutPanel />}
              {activeSection === 'projects' && <MobileProjectsPanel />}
              {activeSection === 'tech' && <MobileTechPanel />}
              {activeSection === 'content' && <MobileContentPanel />}
              {activeSection === 'contact' && <MobileContactPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mobile Panel Components
function MobileAboutPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 rounded-full mb-4">
          <User className="w-10 h-10 text-cyber-green" />
        </div>
        <h2 className="font-display text-xl font-bold text-snow">JORGE HOLGUIN</h2>
        <p className="font-mono text-sm text-cyber-green mt-1">{t.tactical.panels.aboutRole}</p>
      </div>

      <p className="text-mist text-sm text-center">{t.tactical.panels.aboutDesc}</p>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t.about.stats.experience, value: '5+' },
          { label: t.about.stats.systems, value: '50+' },
          { label: t.about.stats.projects, value: '15+' },
        ].map((stat) => (
          <div key={stat.label} className="p-3 bg-graphite/50 border border-steel/30 rounded-lg text-center">
            <div className="font-display text-xl font-bold text-cyber-green">{stat.value}</div>
            <div className="font-mono text-xs text-ghost">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileProjectsPanel() {
  return (
    <div className="space-y-4">
      {mockProjects.slice(0, 3).map((project) => (
        <div key={project.id} className="p-4 bg-graphite/50 border border-steel/30 rounded-lg">
          <span className="px-2 py-1 bg-tactical-amber/10 border border-tactical-amber/30 rounded text-xs font-mono text-tactical-amber uppercase">
            {project.category}
          </span>
          <h3 className="font-semibold text-snow mt-2">{project.title}</h3>
          <p className="text-sm text-ghost mt-1 line-clamp-2">{project.description}</p>
        </div>
      ))}
    </div>
  )
}

function MobileTechPanel() {
  return (
    <div className="space-y-4">
      {Object.entries(techStack).slice(0, 3).map(([category, skills]) => (
        <div key={category} className="p-4 bg-graphite/50 border border-steel/30 rounded-lg">
          <h3 className="font-mono text-sm text-cyber-green uppercase mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill) => (
              <span key={skill.name} className="px-2 py-1 bg-obsidian border border-steel/30 rounded text-xs font-mono text-mist">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MobileContentPanel() {
  const { t } = useLanguage()
  const { videos, loading } = useYouTubeVideos(3)
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-alert-red/10 border border-alert-red/30 rounded-xl">
          <svg className="w-6 h-6 text-alert-red" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-snow">El Hub de Giorgio</h3>
          <p className="font-mono text-xs text-ghost">@elhubdegiorgio</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-alert-red/30 border-t-alert-red rounded-full animate-spin" />
        </div>
      ) : (
        videos.slice(0, 3).map((video) => (
          <a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 bg-graphite/50 border border-steel/30 rounded-lg block overflow-hidden"
          >
            <div className="relative aspect-video mb-2 rounded overflow-hidden bg-graphite">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <span className="px-2 py-1 bg-alert-red/10 border border-alert-red/30 rounded text-xs font-mono text-alert-red">
              {new Date(video.publishedAt).getFullYear()}
            </span>
            <h4 className="font-semibold text-snow mt-2 line-clamp-2">{video.title}</h4>
          </a>
        ))
      )}
    </div>
  )
}

function MobileContactPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      <a
        href="mailto:jahc2026@gmail.com"
        className="flex items-center gap-3 p-4 bg-graphite/50 border border-steel/30 rounded-lg active:border-cyber-green/50"
      >
        <Mail className="w-5 h-5 text-cyber-green" />
        <div>
          <div className="font-mono text-xs text-ghost">{t.contact.info.email.toUpperCase()}</div>
          <div className="text-sm text-snow">jahc2026@gmail.com</div>
        </div>
      </a>

      {[
        { label: 'GitHub', url: 'github.com/jorge-holguin' },
        { label: 'LinkedIn', url: 'linkedin.com/in/jorgeholguin' },
        { label: 'YouTube', url: 'youtube.com/@elhubdegiorgio' },
      ].map((link) => (
        <a
          key={link.label}
          href={`https://${link.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-graphite/50 border border-steel/30 rounded-lg active:border-tactical-amber/50"
        >
          <span className="font-mono text-sm text-tactical-amber">{link.label}</span>
          <span className="text-xs text-ghost">{link.url}</span>
        </a>
      ))}

      <div className="p-4 bg-cyber-green/10 border border-cyber-green/30 rounded-lg text-center">
        <p className="font-mono text-sm text-cyber-green">
          {t.tactical.panels.statusAvailable}
        </p>
      </div>
    </div>
  )
}
