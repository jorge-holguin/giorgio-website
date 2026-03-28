'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork, Calendar, Code } from 'lucide-react'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { useLanguage } from '@/context/LanguageContext'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'

const languageColors: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Java: '#ED8B00',
  Python: '#3776AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  SCSS: '#CC6699',
  Shell: '#89E051',
  Dockerfile: '#2496ED',
  Go: '#00ADD8',
  Rust: '#DEA584',
  C: '#A8B9CC',
  'C++': '#00599C',
  'C#': '#239120',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Swift: '#F05138',
  Kotlin: '#7F52FF',
  Vue: '#4FC08D',
  Svelte: '#FF3E00',
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function GitHubProjects() {
  const { repos, loading, error } = useGitHubRepos()
  const { t, locale } = useLanguage()

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="section-container">
        <SectionHeading
          number="04"
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-hub-orange/30 border-t-hub-orange rounded-full animate-spin mb-4" />
            <p className="font-mono text-sm text-white/60">{t.projects.loading}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-alert-red font-mono">{t.projects.error}</p>
            <p className="text-white/40 text-sm mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.slice(0, 9).map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glow="green" className="h-full flex flex-col">
                  <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-hub-orange/10 border border-hub-orange/30 flex items-center justify-center">
                          <Github className="w-5 h-5 text-hub-orange" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg leading-tight">
                            {repo.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-4 flex-grow line-clamp-3">
                      {repo.description || t.projects.noDescription}
                    </p>

                    {/* Language & Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: languageColors[repo.language] || '#6e7681' }}
                          />
                          <span className="text-white/70">{repo.language}</span>
                        </div>
                      )}
                      {repo.stargazers_count > 0 && (
                        <div className="flex items-center gap-1 text-white/50">
                          <Star className="w-4 h-4" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      )}
                      {repo.forks_count > 0 && (
                        <div className="flex items-center gap-1 text-white/50">
                          <GitFork className="w-4 h-4" />
                          <span>{repo.forks_count}</span>
                        </div>
                      )}
                    </div>

                    {/* Updated date */}
                    <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.projects.updatedAt}: {formatDate(repo.updated_at, locale)}</span>
                    </div>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 text-xs font-mono bg-giorgio-purple/10 text-giorgio-purple border border-giorgio-purple/30 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-hub-orange/10 border border-hub-orange/30 rounded text-hub-orange text-sm font-medium hover:bg-hub-orange/20 transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        {t.projects.viewCode}
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-giorgio-purple/10 border border-giorgio-purple/30 rounded text-giorgio-purple text-sm font-medium hover:bg-giorgio-purple/20 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t.projects.viewLive}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All on GitHub */}
        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <a
              href="https://github.com/jorge-holguin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-void-light border border-white/20 rounded-lg text-white font-medium hover:border-hub-orange/50 hover:text-hub-orange transition-all"
            >
              <Github className="w-5 h-5" />
              {t.projects.viewAll}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
