/**
 * YouTube Service - Repository Pattern
 * Handles YouTube Data API v3 interactions with two-tier caching:
 *   1. In-memory cache (15 min) — fast, per-session
 *   2. Supabase cache (1 hour) — persistent, cross-session
 */

import {
  getCachedVideos, setCachedVideos,
  getCachedChannel, setCachedChannel,
} from './youtube-cache.service'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  videoUrl: string
}

export interface YouTubeChannel {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  subscriberCount: string
  videoCount: string
  uploadsPlaylistId: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in-memory
const cache: Map<string, CacheEntry<unknown>> = new Map()

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export class YouTubeService {
  private static instance: YouTubeService
  private baseUrl = 'https://www.googleapis.com/youtube/v3'
  private apiKey: string
  private channelId: string

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
    this.channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || ''
  }

  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService()
    }
    return YouTubeService.instance
  }

  private isConfigured(): boolean {
    return Boolean(this.apiKey && this.channelId)
  }

  async getChannelInfo(): Promise<YouTubeChannel | null> {
    if (!this.isConfigured()) {
      console.warn('YouTube API not configured')
      return null
    }

    const cacheKey = `channel_${this.channelId}`

    // Tier 1: in-memory
    const memCached = getFromCache<YouTubeChannel>(cacheKey)
    if (memCached) return memCached

    // Tier 2: Supabase
    const sbCached = await getCachedChannel(cacheKey)
    if (sbCached) {
      setCache(cacheKey, sbCached)
      return sbCached
    }

    // Tier 3: YouTube API
    try {
      const response = await fetch(
        `${this.baseUrl}/channels?part=snippet,statistics,contentDetails&id=${this.channelId}&key=${this.apiKey}`,
        { next: { revalidate: 900 } }
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.items || data.items.length === 0) {
        return null
      }

      const channel = data.items[0]
      const channelInfo: YouTubeChannel = {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnailUrl: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
      }

      setCache(cacheKey, channelInfo)
      setCachedChannel(cacheKey, channelInfo).catch(() => {})
      return channelInfo
    } catch (error) {
      console.error('Error fetching channel info:', error)
      throw error
    }
  }

  async getLatestVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
    if (!this.isConfigured()) {
      console.warn('YouTube API not configured')
      return []
    }

    const cacheKey = `videos_${this.channelId}_${maxResults}`

    // Tier 1: in-memory
    const memCached = getFromCache<YouTubeVideo[]>(cacheKey)
    if (memCached) return memCached

    // Tier 2: Supabase
    const sbCached = await getCachedVideos(cacheKey)
    if (sbCached) {
      setCache(cacheKey, sbCached)
      return sbCached
    }

    // Tier 3: YouTube API
    try {
      const channelInfo = await this.getChannelInfo()
      if (!channelInfo) {
        return []
      }

      const response = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&playlistId=${channelInfo.uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`,
        { next: { revalidate: 900 } }
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      
      const videos: YouTubeVideo[] = data.items.map((item: {
        snippet: {
          resourceId: { videoId: string }
          title: string
          description: string
          thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
          publishedAt: string
        }
      }) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || 
                      item.snippet.thumbnails.medium?.url || 
                      item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      }))

      setCache(cacheKey, videos)
      setCachedVideos(cacheKey, videos).catch(() => {})
      return videos
    } catch (error) {
      console.error('Error fetching latest videos:', error)
      throw error
    }
  }
}

// Export singleton instance
export const youtubeService = YouTubeService.getInstance()
