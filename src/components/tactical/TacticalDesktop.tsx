'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Briefcase, Code2, Mail, FileText, Target, Shield, Cpu } from 'lucide-react'
import { mockProjects, techStack } from '@/data/mock-data'
import { useLanguage } from '@/context/LanguageContext'
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos'

type HotspotId = 'about' | 'projects' | 'tech' | 'content' | 'contact' | null

interface Hotspot {
  id: Exclude<HotspotId, null>
  icon: React.ComponentType<{ className?: string }>
  position: { x: string; y: string }
  color: string
}

const hotspotDefs: Hotspot[] = [
  { id: 'about', icon: User, position: { x: '20%', y: '35%' }, color: 'cyber-green' },
  { id: 'projects', icon: Briefcase, position: { x: '75%', y: '30%' }, color: 'tactical-amber' },
  { id: 'tech', icon: Code2, position: { x: '50%', y: '60%' }, color: 'cyber-green' },
  { id: 'content', icon: User, position: { x: '25%', y: '70%' }, color: 'alert-red' },
  { id: 'contact', icon: Mail, position: { x: '80%', y: '65%' }, color: 'tactical-amber' },
]

export default function TacticalDesktop() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const { t } = useLanguage()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div
      className="relative w-full h-full cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* Background - Tactical Room */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-void to-graphite">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center bottom',
          }}
        />
        <div className="absolute inset-0 bg-radial-glow opacity-30" />
        <div className="scan-line opacity-30" />
      </div>

      {/* HUD Frame */}
      <div className="absolute inset-4 pointer-events-none">
        <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyber-green/40" />
        <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-cyber-green/40" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-cyber-green/40" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyber-green/40" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
          <h1 className="font-display text-2xl font-bold text-cyber-green tracking-widest">
            {t.tactical.briefingRoom}
          </h1>
          <p className="font-mono text-xs text-ghost mt-1">
            {t.tactical.selectTarget}
          </p>
        </div>

        <div className="absolute bottom-8 left-8 font-mono text-xs text-ghost space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-green" />
            <span>{t.tactical.secureConnection}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-tactical-amber" />
            <span>{t.tactical.systemActive}</span>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 font-mono text-xs text-ghost">
          <p>X: {cursorPos.x.toString().padStart(4, '0')}</p>
          <p>Y: {cursorPos.y.toString().padStart(4, '0')}</p>
        </div>
      </div>

      {/* Hotspots */}
      {hotspotDefs.map((hotspot) => {
        const Icon = hotspot.icon
        const isActive = activeHotspot === hotspot.id
        const label = t.tactical.hotspots[hotspot.id]

        return (
          <motion.button
            key={hotspot.id}
            onClick={() => setActiveHotspot(hotspot.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group`}
            style={{ left: hotspot.position.x, top: hotspot.position.y }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`absolute inset-0 w-20 h-20 -m-4 rounded-full bg-${hotspot.color}/20 animate-ping`} />
            <div className={`
              relative w-12 h-12 flex items-center justify-center
              bg-graphite/80 backdrop-blur-sm border-2 rounded-lg
              transition-all duration-300 cursor-pointer
              ${isActive ? `border-${hotspot.color} shadow-[0_0_30px_rgba(74,222,128,0.4)]` : `border-${hotspot.color}/50`}
              group-hover:border-${hotspot.color} group-hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
            `}>
              <Icon className={`w-6 h-6 text-${hotspot.color}`} />
            </div>
            <div className={`
              absolute top-full left-1/2 -translate-x-1/2 mt-3
              px-3 py-1 bg-graphite/90 backdrop-blur-sm border border-${hotspot.color}/30 rounded
              font-mono text-xs text-${hotspot.color} whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity
            `}>
              <Target className="w-3 h-3 inline-block mr-1" />
              {label}
            </div>
          </motion.button>
        )
      })}

      {/* Custom scanner cursor element */}
      <div
        className="fixed pointer-events-none z-30"
        style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%, -50%)' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="1" />
          <circle cx="20" cy="20" r="2" fill="rgba(74, 222, 128, 0.8)" />
          <line x1="20" y1="0" x2="20" y2="10" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="1" />
          <line x1="20" y1="30" x2="20" y2="40" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="1" />
          <line x1="0" y1="20" x2="10" y2="20" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="1" />
          <line x1="30" y1="20" x2="40" y2="20" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="1" />
        </svg>
      </div>

      {/* Info Panel Overlay */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-8 bg-void/80 backdrop-blur-sm"
            onClick={() => setActiveHotspot(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[80vh] overflow-auto bg-graphite/95 backdrop-blur-xl border border-cyber-green/30 rounded-lg"
            >
              <div className="sticky top-0 flex items-center justify-between p-4 bg-obsidian/90 backdrop-blur-sm border-b border-steel/30 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 rounded">
                    <FileText className="w-4 h-4 text-cyber-green" />
                  </div>
                  <span className="font-display text-lg font-semibold text-snow uppercase tracking-wider">
                    {t.tactical.hotspots[activeHotspot as keyof typeof t.tactical.hotspots]}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-2 text-ghost hover:text-snow transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {activeHotspot === 'about' && <AboutPanel />}
                {activeHotspot === 'projects' && <ProjectsPanel />}
                {activeHotspot === 'tech' && <TechPanel />}
                {activeHotspot === 'content' && <ContentPanel />}
                {activeHotspot === 'contact' && <ContactPanel />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Panel Components
function AboutPanel() {
  const { t } = useLanguage()
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 rounded-lg flex-shrink-0">
          <User className="w-12 h-12 text-cyber-green" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-snow mb-2">JORGE HOLGUIN</h2>
          <p className="font-mono text-sm text-cyber-green mb-4">{t.tactical.panels.aboutRole}</p>
          <p className="text-mist">{t.tactical.panels.aboutDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.about.stats.experience, value: '5+' },
          { label: t.about.stats.systems, value: '50+' },
          { label: t.about.stats.projects, value: '15+' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg text-center">
            <div className="font-display text-2xl font-bold text-cyber-green">{stat.value}</div>
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
        {mockProjects.slice(0, 3).map((project) => (
          <div key={project.id} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg hover:border-tactical-amber/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-snow">{project.title}</h3>
              <span className="px-2 py-1 bg-tactical-amber/10 border border-tactical-amber/30 rounded text-xs font-mono text-tactical-amber uppercase">
                {project.category}
              </span>
            </div>
            <p className="text-sm text-ghost mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
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
        {Object.entries(techStack).slice(0, 4).map(([category, skills]) => (
          <div key={category} className="p-4 bg-obsidian/50 border border-steel/30 rounded-lg">
            <h3 className="font-mono text-sm text-cyber-green uppercase mb-4">{category}</h3>
            <div className="grid grid-cols-4 gap-3">
              {skills.slice(0, 4).map((skill) => (
                <div key={skill.name} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 relative">
                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
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
        <div className="w-16 h-16 flex items-center justify-center bg-alert-red/10 border border-alert-red/30 rounded-xl">
          <svg className="w-8 h-8 text-alert-red" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-snow">El Hub de Giorgio</h3>
          <p className="font-mono text-sm text-ghost">@elhubdegiorgio</p>
        </div>
      </div>

      <p className="text-mist">{t.tactical.panels.contentDesc}</p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-alert-red/30 border-t-alert-red rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {videos.slice(0, 4).map((video) => (
            <a
              key={video.id}
              href={video.videoUrl}
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
          <Mail className="w-6 h-6 text-cyber-green" />
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
            <span className="font-mono text-sm text-tactical-amber">{link.label}</span>
            <span className="text-sm text-ghost">{link.url}</span>
          </a>
        ))}
      </div>

      <div className="p-4 bg-tactical-amber/10 border border-tactical-amber/30 rounded-lg">
        <p className="font-mono text-sm text-tactical-amber">
          {t.tactical.panels.statusAvailable}
        </p>
      </div>
    </div>
  )
}
