'use client'

import { motion } from 'framer-motion'
import { Play, ExternalLink, Sparkles, Loader2, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { mockFeaturedContent } from '@/data/mock-data'
import { useLanguage } from '@/context/LanguageContext'
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos'

export default function Content() {
  const { t } = useLanguage()
  const { videos, channel, loading, error } = useYouTubeVideos(4)

  // Use real videos if available, fall back to mock data
  const hasRealVideos = videos.length > 0

  return (
    <section id="content" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-void to-obsidian/30" />
      <div className="grid-overlay opacity-20" />

      <div className="relative section-container">
        <SectionHeading
          number="05"
          title={t.content.title}
          subtitle={t.content.subtitle}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Channel info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass-panel p-6 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-alert-red/10 border border-alert-red/30 rounded-xl overflow-hidden">
                  {channel?.thumbnailUrl ? (
                    <Image
                      src={channel.thumbnailUrl}
                      alt={channel.title}
                      width={64}
                      height={64}
                      className="rounded-xl"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-alert-red" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-snow">
                    {channel?.title || 'El Hub de Giorgio'}
                  </h3>
                  <p className="text-sm text-ghost font-mono">@elhubdegiorgio</p>
                  {channel && (
                    <p className="text-xs text-ghost font-mono mt-1">
                      {Number(channel.subscriberCount).toLocaleString()} subs · {Number(channel.videoCount).toLocaleString()} videos
                    </p>
                  )}
                </div>
              </div>

              <p className="text-mist mb-6">
                {channel?.description
                  ? channel.description.slice(0, 200) + (channel.description.length > 200 ? '...' : '')
                  : t.content.channelDescription}
              </p>

              <div className="mb-6">
                <h4 className="font-mono text-sm text-cyber-green uppercase mb-3">{t.content.topicsCovered}</h4>
                <div className="flex flex-wrap gap-2">
                  {t.content.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-graphite border border-steel/30 rounded-full text-xs text-mist"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                href="https://youtube.com/@elhubdegiorgio"
                external
                variant="secondary"
                icon={<ExternalLink className="w-4 h-4" />}
                className="w-full"
              >
                {t.content.visitChannel}
              </Button>
            </div>
          </motion.div>

          {/* Featured content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-tactical-amber" />
              <h3 className="font-mono text-sm text-tactical-amber uppercase">{t.content.featuredContent}</h3>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-cyber-green animate-spin" />
              </div>
            )}

            {/* Error state - show mock data as fallback */}
            {error && !hasRealVideos && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-tactical-amber/10 border border-tactical-amber/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-tactical-amber flex-shrink-0" />
                <span className="text-sm text-tactical-amber font-mono">Using cached content</span>
              </div>
            )}

            {/* Real YouTube videos */}
            {!loading && hasRealVideos && (
              <div className="grid sm:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <motion.a
                    key={video.id}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-panel p-4 h-full hover:border-alert-red/30 transition-all">
                      <div className="relative aspect-video bg-graphite rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 flex items-center justify-center bg-alert-red/90 rounded-full group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white-pure ml-1" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-void/80 backdrop-blur-sm rounded text-xs font-mono text-mist">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-semibold text-snow mb-2 group-hover:text-alert-red transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-sm text-ghost line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* Fallback to mock data when no real videos */}
            {!loading && !hasRealVideos && (
              <div className="grid sm:grid-cols-2 gap-4">
                {mockFeaturedContent.slice(0, 4).map((content, index) => (
                  <motion.a
                    key={content.id}
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-panel p-4 h-full hover:border-alert-red/30 transition-all">
                      <div className="relative aspect-video bg-graphite rounded-lg mb-4 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-alert-red/20 to-tactical-amber/10">
                          <div className="w-12 h-12 flex items-center justify-center bg-alert-red/90 rounded-full group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white-pure ml-1" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-1 bg-void/80 backdrop-blur-sm rounded text-xs font-mono text-mist">
                          {content.topic}
                        </span>
                      </div>

                      <h4 className="font-semibold text-snow mb-2 group-hover:text-alert-red transition-colors line-clamp-2">
                        {content.title}
                      </h4>
                      <p className="text-sm text-ghost line-clamp-2">
                        {content.description}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* View more */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center pt-4"
            >
              <Button
                href="https://youtube.com/@elhubdegiorgio"
                external
                variant="ghost"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                }
              >
                {t.content.viewAllVideos}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
