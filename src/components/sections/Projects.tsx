'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, ExternalLink, Github, ChevronRight, X, FileText } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { mockProjects } from '@/data/mock-data'
import type { Project } from '@/types/database'

const categories = [
  { id: 'all', label: 'All Cases' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'backend', label: 'Backend' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'ai', label: 'AI/ML' },
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = activeCategory === 'all'
    ? mockProjects
    : mockProjects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-void to-obsidian/30" />
      <div className="grid-overlay opacity-20" />

      <div className="relative section-container">
        <SectionHeading
          number="03"
          title="Case Files"
          subtitle="Selected projects showcasing system design and technical problem-solving"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 font-mono text-sm rounded transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyber-green/20 border border-cyber-green/50 text-cyber-green'
                  : 'bg-graphite/40 border border-steel/30 text-ghost hover:text-snow hover:border-steel/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer"
              >
                <div className="relative h-full glass-panel p-6 hover:border-cyber-green/40 transition-all duration-300">
                  {/* HUD corners */}
                  <span className="hud-corner hud-corner-tl" />
                  <span className="hud-corner hud-corner-tr" />
                  <span className="hud-corner hud-corner-bl" />
                  <span className="hud-corner hud-corner-br" />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 rounded-lg group-hover:bg-cyber-green/20 transition-colors">
                      <FolderOpen className="w-6 h-6 text-cyber-green" />
                    </div>
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <span className="px-2 py-1 bg-tactical-amber/10 border border-tactical-amber/30 rounded text-xs font-mono text-tactical-amber">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-snow mb-2 group-hover:text-cyber-green transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-ghost mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Stack preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-graphite border border-steel/30 rounded text-xs font-mono text-mist"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="px-2 py-1 text-xs font-mono text-ghost">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* View details indicator */}
                  <div className="flex items-center gap-2 text-sm text-cyber-green/70 group-hover:text-cyber-green transition-colors">
                    <FileText className="w-4 h-4" />
                    <span className="font-mono">View case file</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-auto glass-panel p-8"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-ghost hover:text-snow transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* HUD corners */}
              <span className="hud-corner hud-corner-tl" />
              <span className="hud-corner hud-corner-tr" />
              <span className="hud-corner hud-corner-bl" />
              <span className="hud-corner hud-corner-br" />

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded text-xs font-mono text-cyber-green uppercase">
                    Case #{selectedProject.id}
                  </span>
                  <span className="px-2 py-1 bg-graphite border border-steel/30 rounded text-xs font-mono text-ghost">
                    {selectedProject.category}
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold text-snow">
                  {selectedProject.title}
                </h2>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-mono text-sm text-cyber-green uppercase mb-2">{'// '}Problem</h3>
                  <p className="text-mist">{selectedProject.problem}</p>
                </div>

                <div>
                  <h3 className="font-mono text-sm text-cyber-green uppercase mb-2">{'// '}Solution</h3>
                  <p className="text-mist">{selectedProject.solution}</p>
                </div>

                <div>
                  <h3 className="font-mono text-sm text-cyber-green uppercase mb-2">{'// '}Outcome</h3>
                  <p className="text-mist">{selectedProject.outcome}</p>
                </div>

                <div>
                  <h3 className="font-mono text-sm text-cyber-green uppercase mb-2">{'// '}Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded text-sm font-mono text-cyber-green"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-steel/30">
                  {selectedProject.live_url && (
                    <Button
                      href={selectedProject.live_url}
                      external
                      variant="primary"
                      size="sm"
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      Live Demo
                    </Button>
                  )}
                  {selectedProject.github_url && (
                    <Button
                      href={selectedProject.github_url}
                      external
                      variant="secondary"
                      size="sm"
                      icon={<Github className="w-4 h-4" />}
                    >
                      Source Code
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
