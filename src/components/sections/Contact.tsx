'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Download, Github, Linkedin, Youtube, Mail, MapPin, CheckCircle, AlertCircle, Twitter, MessageCircle } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { socialLinks, siteConfig } from '@/data/social-links'

const socialLinksData = [
  { id: 'github', platform: 'GitHub', url: socialLinks.github, icon: Github },
  { id: 'linkedin', platform: 'LinkedIn', url: socialLinks.linkedin, icon: Linkedin },
  { id: 'youtube', platform: 'YouTube', url: socialLinks.youtube, icon: Youtube },
  { id: 'twitter', platform: 'X/Twitter', url: socialLinks.twitter, icon: Twitter },
  { id: 'discord', platform: 'Discord', url: socialLinks.discord, icon: MessageCircle },
]

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission - Replace with actual Supabase call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // In production, use: await submitContactForm(formData)
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-obsidian/30">
      <div className="grid-overlay opacity-10" />

      <div className="relative section-container">
        <SectionHeading
          number="06"
          title={t.contact.title}
          subtitle={t.contact.subtitle}
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="glass-panel p-6">
              <h3 className="font-display text-xl font-semibold text-snow mb-4">
                {t.contact.getInTouch}
              </h3>
              <p className="text-mist mb-6">
                {t.contact.availableText}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-mist">
                  <div className="w-10 h-10 flex items-center justify-center bg-hub-orange/10 border border-hub-orange/30 rounded-lg">
                    <Mail className="w-5 h-5 text-hub-orange" />
                  </div>
                  <a href={`mailto:${socialLinks.email}`} className="font-mono text-sm hover:text-hub-orange transition-colors">
                    {socialLinks.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-mist">
                  <div className="w-10 h-10 flex items-center justify-center bg-hub-orange/10 border border-hub-orange/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-hub-orange" />
                  </div>
                  <span className="font-mono text-sm">{t.contact.info.locationValue}</span>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="glass-panel p-6">
              <h3 className="font-mono text-sm text-hub-orange uppercase mb-4">{t.contact.social}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinksData.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-graphite border border-steel/30 rounded-lg hover:border-hub-orange/50 hover:bg-hub-orange/5 transition-all group"
                      aria-label={social.platform}
                    >
                      <Icon className="w-5 h-5 text-ghost group-hover:text-hub-orange transition-colors" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Download CV */}
            <a
              href={siteConfig.cvPath}
              download
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-hub-orange/10 border border-hub-orange/30 rounded-lg text-hub-orange font-medium hover:bg-hub-orange/20 transition-all"
            >
              <Download className="w-5 h-5" />
              {t.contact.downloadCV}
            </a>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-alert-red" />
                <div className="w-3 h-3 rounded-full bg-tactical-amber" />
                <div className="w-3 h-3 rounded-full bg-cyber-green" />
                <span className="ml-auto font-mono text-xs text-ghost">contact_form.tsx</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-mono text-sm text-mist mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-graphite border border-steel/30 rounded-lg text-snow placeholder-ghost focus:outline-none focus:border-cyber-green/50 transition-colors"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-mono text-sm text-mist mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-graphite border border-steel/30 rounded-lg text-snow placeholder-ghost focus:outline-none focus:border-cyber-green/50 transition-colors"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block font-mono text-sm text-mist mb-2">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-graphite border border-steel/30 rounded-lg text-snow placeholder-ghost focus:outline-none focus:border-cyber-green/50 transition-colors"
                  placeholder={t.contact.form.subjectPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-mono text-sm text-mist mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-graphite border border-steel/30 rounded-lg text-snow placeholder-ghost focus:outline-none focus:border-cyber-green/50 transition-colors resize-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-cyber-green"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-mono text-sm">{t.contact.form.success}</span>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-alert-red"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-mono text-sm">{t.contact.form.error}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'loading'}
                icon={<Send className="w-5 h-5" />}
                className="w-full"
              >
                {status === 'loading' ? t.contact.form.sending : t.contact.form.submit}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
