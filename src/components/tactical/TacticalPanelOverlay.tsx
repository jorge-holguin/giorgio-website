'use client'

import { motion } from 'framer-motion'
import { X, User, Briefcase, Code2, Mail, FileText } from 'lucide-react'
import { mockProjects, techStack } from '@/data/mock-data'
import { useLanguage } from '@/context/LanguageContext'
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos'

interface TacticalPanelOverlayProps {
  panelType: string
  onClose: () => void
}

export default function TacticalPanelOverlay({ panelType, onClose }: TacticalPanelOverlayProps) {
  const { t } = useLanguage()

  const getPanelTitle = () => {
    const key = panelType as keyof typeof t.tactical.hotspots
    return t.tactical.hotspots[key] || ''
  }

  const getPanelColor = () => {
    switch (panelType) {
      case 'about': return '#00ff41'
      case 'projects': return '#f59e0b'
      case 'tech': return '#00ff41'
      case 'content': return '#ef4444'
      case 'contact': return '#f59e0b'
      default: return '#00ff41'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-void/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-auto bg-graphite/95 backdrop-blur-xl border-2 rounded-lg"
        style={{ borderColor: getPanelColor() }}
      >
        {/* Panel header */}
        <div 
          className="sticky top-0 flex items-center justify-between p-4 backdrop-blur-sm border-b z-10"
          style={{ backgroundColor: `${getPanelColor()}15`, borderColor: `${getPanelColor()}40` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center border-2 rounded"
              style={{ borderColor: getPanelColor(), backgroundColor: `${getPanelColor()}15` }}
            >
              <FileText className="w-5 h-5" style={{ color: getPanelColor() }} />
            </div>
            <span 
              className="font-display text-xl font-bold uppercase tracking-wider"
              style={{ color: getPanelColor() }}
            >
              {getPanelTitle()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ghost hover:text-snow transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Panel content */}
        <div className="p-6">
          {panelType === 'about' && <AboutPanel />}
          {panelType === 'projects' && <ProjectsPanel />}
          {panelType === 'tech' && <TechPanel />}
          {panelType === 'content' && <ContentPanel />}
          {panelType === 'contact' && <ContactPanel />}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Panel Components
function AboutPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-28 h-28 flex items-center justify-center bg-cyber-green/10 border-2 border-cyber-green/30 rounded-lg flex-shrink-0">
          <User className="w-14 h-14 text-cyber-green" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-snow mb-2">JORGE HOLGUIN</h2>
          <p className="font-mono text-sm text-cyber-green mb-4">{t.tactical.panels.aboutRole}</p>
          <p className="text-mist text-lg">{t.tactical.panels.aboutDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.about.stats.experience, value: '5+' },
          { label: t.about.stats.systems, value: '50+' },
          { label: t.about.stats.projects, value: '15+' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg text-center">
            <div className="font-display text-3xl font-bold text-cyber-green">{stat.value}</div>
            <div className="font-mono text-xs text-ghost uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      <p className="font-mono text-sm text-ghost mb-6">{t.tactical.panels.missionFiles}</p>
      <div className="grid gap-4">
        {mockProjects.slice(0, 4).map((project) => (
          <div key={project.id} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg hover:border-tactical-amber/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-snow text-lg">{project.title}</h3>
              <span className="px-2 py-1 bg-tactical-amber/10 border border-tactical-amber/30 rounded text-xs font-mono text-tactical-amber uppercase">
                {project.category}
              </span>
            </div>
            <p className="text-mist mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 5).map((tech) => (
                <span key={tech} className="px-2 py-1 bg-graphite border border-steel/30 rounded text-xs font-mono text-mist">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TechPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <p className="font-mono text-sm text-ghost">{t.tactical.panels.equipmentLoadout}</p>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(techStack).map(([category, skills]) => (
          <div key={category} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg">
            <h3 className="font-mono text-sm text-cyber-green uppercase mb-4">{category}</h3>
            <div className="grid grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div key={skill.name} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 relative">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-mono text-xs text-snow text-center">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentPanel() {
  const { t } = useLanguage()
  const { videos, loading } = useYouTubeVideos(4)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 flex items-center justify-center bg-alert-red/10 border-2 border-alert-red/30 rounded-xl">
          <svg className="w-10 h-10 text-alert-red" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-snow">El Hub de Giorgio</h3>
          <p className="font-mono text-sm text-ghost">@elhubdegiorgio</p>
        </div>
      </div>

      <p className="text-mist text-lg">{t.tactical.panels.contentDesc}</p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-alert-red/30 border-t-alert-red rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {videos.slice(0, 4).map((video) => (
            <a
              key={video.id}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-obsidian/50 border border-steel/30 rounded-lg hover:border-alert-red/50 transition-all block overflow-hidden"
            >
              <div className="relative aspect-video mb-3 rounded overflow-hidden bg-graphite">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="px-2 py-1 bg-alert-red/10 border border-alert-red/30 rounded text-xs font-mono text-alert-red">
                {new Date(video.publishedAt).getFullYear()}
              </span>
              <h4 className="font-semibold text-snow mt-2 line-clamp-2 group-hover:text-alert-red transition-colors">{video.title}</h4>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <p className="font-mono text-sm text-ghost">{t.tactical.panels.establishComms}</p>

      <div className="grid gap-4">
        <a
          href="mailto:jahc2026@gmail.com"
          className="flex items-center gap-4 p-4 bg-obsidian/50 border border-steel/30 rounded-lg hover:border-cyber-green/50 transition-colors"
        >
          <Mail className="w-8 h-8 text-cyber-green" />
          <div>
            <div className="font-mono text-sm text-ghost">{t.contact.info.email.toUpperCase()}</div>
            <div className="text-snow">jahc2026@gmail.com</div>
          </div>
        </a>

        {[
          { label: 'GITHUB', url: 'https://github.com/jorge-holguin' },
          { label: 'LINKEDIN', url: 'https://linkedin.com/in/jorgeholguin' },
          { label: 'YOUTUBE', url: 'https://youtube.com/@elhubdegiorgio' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-obsidian/50 border border-steel/30 rounded-lg hover:border-tactical-amber/50 transition-colors"
          >
            <span className="font-mono text-lg text-tactical-amber">{link.label}</span>
            <span className="text-sm text-ghost">{link.url}</span>
          </a>
        ))}
      </div>

      <div className="p-4 bg-tactical-amber/10 border-2 border-tactical-amber/30 rounded-lg">
        <p className="font-mono text-sm text-tactical-amber">
          {t.tactical.panels.statusAvailable}
        </p>
      </div>
    </div>
  )
}
