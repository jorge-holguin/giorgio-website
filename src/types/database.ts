// Supabase Database Types
// These types define the structure for Supabase tables

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at'>
        Update: Partial<Omit<Project, 'id'>>
      }
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id'>
        Update: Partial<Omit<Experience, 'id'>>
      }
      social_links: {
        Row: SocialLink
        Insert: Omit<SocialLink, 'id'>
        Update: Partial<Omit<SocialLink, 'id'>>
      }
      featured_content: {
        Row: FeaturedContent
        Insert: Omit<FeaturedContent, 'id' | 'created_at'>
        Update: Partial<Omit<FeaturedContent, 'id'>>
      }
      contact_submissions: {
        Row: ContactSubmission
        Insert: Omit<ContactSubmission, 'id'>
        Update: Partial<Omit<ContactSubmission, 'id'>>
      }
      youtube_cache: {
        Row: YouTubeCache
        Insert: Omit<YouTubeCache, 'id'>
        Update: Partial<Omit<YouTubeCache, 'id'>>
      }
    }
  }
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  problem: string
  solution: string
  outcome: string
  stack: string[]
  image_url?: string
  live_url?: string
  github_url?: string
  featured: boolean
  category: 'healthcare' | 'backend' | 'fullstack' | 'ai' | 'api'
  created_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  location: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
}

export interface FeaturedContent {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'podcast'
  url: string
  thumbnail_url?: string
  topic: string
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  read: boolean
}

export interface YouTubeCache {
  id: string
  cache_key: string
  data: Record<string, unknown>
  expires_at: string
  created_at: string
}
